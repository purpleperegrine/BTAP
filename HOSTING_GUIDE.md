# Hosting Barley’s beside Clean Slate

This procedure keeps the existing Clean Slate site as Nginx’s default site and
adds Barley’s only for `dankjavis.com` and `www.dankjavis.com`.

## Architecture

```text
Visitor
  -> Cloudflare
  -> existing Cloudflare Tunnel
  -> Nginx at http://127.0.0.1:8080
       -> cleanslatehomewash.com: /var/www/html
       -> dankjavis.com:          http://127.0.0.1:3000
```

Do **not** point `dankjavis.com` to `24.49.181.234` with an A record. A Tunnel
uses a CNAME/public-application route to `<TUNNEL-UUID>.cfargotunnel.com` and
does not require inbound router ports or a public origin IP.

## 1. Preflight checks

Run these on the Linux server:

```bash
node --version
npm --version
command -v npm
sudo systemctl status nginx --no-pager
sudo systemctl status cloudflared --no-pager
sudo systemctl cat cloudflared
```

Requirements and cautions:

- Node must be `22.13.0` or newer.
- Note the full path printed by `command -v npm`; systemd needs that path.
- Do not share the output of `systemctl cat cloudflared` if it contains a
  `--token` value. That token is a secret.
- If the cloudflared service uses `run --token`, the tunnel is remotely managed.
- If it references a YAML file, tunnel UUID, and credentials file, it is locally
  managed.

If `node --version` reports Node 18, install Node 24 LTS with `nvm` as the normal
application user. Do not use `sudo` for these commands. This leaves the existing
system Node installation untouched:

```bash
cd ~
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.5/install.sh | bash

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

nvm install 24.18.0
nvm alias default 24.18.0
nvm use 24.18.0

node --version
npm --version
command -v node
command -v npm
```

The expected Node result is `v24.18.0`. If `nvm` is unavailable after the
installer finishes, reconnect the SSH session or run the two `NVM_DIR` lines
again.

## 2. Install and build the Barley’s app

On the current host, the project path shown in the terminal is `/var/www/btap`:

```bash
cd /var/www/btap
npm ci
npm run build
```

Do not use `npm ci --omit=dev`: this project uses `vinext`, which is currently a
development dependency but is required by its build and start scripts.

Test the production server in the foreground:

```bash
npm run start -- --hostname 127.0.0.1 --port 3000
```

In a second shell:

```bash
curl -I http://127.0.0.1:3000/
```

Expect an HTTP `200`. Stop the foreground server with `Ctrl-C` after the test.

## 3. Keep the app running with systemd

Create `/etc/systemd/system/barleys.service`:

```ini
[Unit]
Description=Barley's Taproom website
Wants=network-online.target
After=network-online.target

[Service]
Type=simple
User=YOUR_LINUX_USER
Group=YOUR_LINUX_GROUP
WorkingDirectory=/var/www/btap
Environment=NODE_ENV=production
Environment="PATH=/home/YOUR_LINUX_USER/.nvm/versions/node/v24.18.0/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
ExecStart=/home/YOUR_LINUX_USER/.nvm/versions/node/v24.18.0/bin/npm run start -- --hostname 127.0.0.1 --port 3000
Restart=on-failure
RestartSec=5
KillSignal=SIGTERM
TimeoutStopSec=20

[Install]
WantedBy=multi-user.target
```

Replace the user and group with the values from `whoami` and `id -gn`. Confirm
that the npm path matches `command -v npm`. Systemd does not load `nvm` or
`.bashrc`, so both the absolute `ExecStart` path and the Node `bin` directory at
the beginning of `PATH` are required.

Enable and test the service:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now barleys
sudo systemctl status barleys --no-pager
sudo journalctl -u barleys -n 50 --no-pager
curl -I http://127.0.0.1:3000/
```

Do not continue until the final curl returns `200`.

## 4. Install the reviewed Nginx configuration

The reviewed file is `default.txt` in this project. First back up the working
server configuration:

```bash
sudo cp -a /etc/nginx/sites-available/default /etc/nginx/sites-available/default.pre-barleys
```

Copy `default.txt` into place, using its actual path on the server:

```bash
sudo cp /var/www/btap/default.txt /etc/nginx/sites-available/default
```

Validate before reloading:

```bash
sudo nginx -t
```

If that command reports any error, stop. Nginx is still using the old loaded
configuration. Restore the backup or correct the reported path/line before doing
anything else.

If the test succeeds, perform a graceful reload:

```bash
sudo systemctl reload nginx
```

Test both virtual hosts locally:

```bash
curl -I -H 'Host: cleanslatehomewash.com' http://127.0.0.1:8080/
curl -I -H 'Host: dankjavis.com' http://127.0.0.1:8080/
```

Both should return `200`. A `502` for `dankjavis.com` means the Barley’s service
is not reachable on port 3000; it does not mean the Clean Slate files were
changed.

## 5A. Remotely managed Cloudflare Tunnel

This is the likely case if cloudflared runs with `--token`.

1. Open Cloudflare and go to **Networking -> Tunnels**.
2. Select the existing working tunnel.
3. Open **Routes** and choose **Add route -> Published application**.
4. Add `dankjavis.com` with service URL `http://localhost:8080`.
5. Add `www.dankjavis.com` as a second route with the same service URL.
6. Leave **HTTP Host Header** blank so Nginx receives the requested hostname.

Cloudflare should create the tunnel DNS records. If either hostname already has
an A, AAAA, or CNAME record, review and remove that conflicting record first.
Do not change or delete the existing Clean Slate route.

No cloudflared restart is normally needed for a remotely managed route.

## 5B. Locally managed Cloudflare Tunnel

Back up the YAML file named in the cloudflared systemd unit. Preserve every
existing rule, then insert only these two rules immediately before its final
catch-all rule:

```yaml
  - hostname: dankjavis.com
    service: http://127.0.0.1:8080

  - hostname: www.dankjavis.com
    service: http://127.0.0.1:8080

  - service: http_status:404
```

The catch-all must remain last. Validate both the syntax and rule selection:

```bash
cloudflared tunnel ingress validate
cloudflared tunnel ingress rule https://dankjavis.com
cloudflared tunnel ingress rule https://www.dankjavis.com
cloudflared tunnel ingress rule https://cleanslatehomewash.com
```

If the systemd unit specifies a non-default config path, add its same
`--config /path/config.yml` argument to those commands.

Create the two tunnel DNS routes:

```bash
cloudflared tunnel route dns TUNNEL_NAME_OR_UUID dankjavis.com
cloudflared tunnel route dns TUNNEL_NAME_OR_UUID www.dankjavis.com
```

Then restart and inspect cloudflared:

```bash
sudo systemctl restart cloudflared
sudo systemctl status cloudflared --no-pager
sudo journalctl -u cloudflared -n 50 --no-pager
```

Do not install a second cloudflared system service. One tunnel can publish many
hostnames.

## 6. Final checks

```bash
curl -I https://dankjavis.com/
curl -I https://www.dankjavis.com/
curl -I https://cleanslatehomewash.com/
curl -I https://www.cleanslatehomewash.com/
```

Open all four addresses in a browser. Confirm the two Dank Javis hostnames show
Barley’s and both Clean Slate hostnames still show the pressure-washing site.

No inbound port-forward for 3000 or 8080 is required. The app itself is bound to
loopback, and Cloudflare Tunnel makes outbound connections to Cloudflare.

## Rollback

To remove the Nginx change:

```bash
sudo cp -a /etc/nginx/sites-available/default.pre-barleys /etc/nginx/sites-available/default
sudo nginx -t
sudo systemctl reload nginx
```

Then delete only the two new Dank Javis published-application/DNS routes. For a
locally managed tunnel, restore its YAML backup, validate it, and restart
cloudflared. The existing Clean Slate route and tunnel connector remain in place.

## References

- [Cloudflare Tunnel routing and DNS](https://developers.cloudflare.com/tunnel/routing/)
- [Cloudflare local ingress rules](https://developers.cloudflare.com/tunnel/advanced/local-management/configuration-file/)
- [Cloudflare origin parameters](https://developers.cloudflare.com/tunnel/advanced/origin-parameters/)
- [Cloudflare HTTP headers](https://developers.cloudflare.com/fundamentals/reference/http-headers/)
- [How Nginx selects virtual servers](https://nginx.org/en/docs/http/request_processing.html)
- [Nginx reverse-proxy headers](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_set_header)
