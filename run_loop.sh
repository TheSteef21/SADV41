#!/data/data/com.termux/files/usr/bin/bash
cd ~/sadv41
set -a; . ~/.sadv41_env; set +a
termux-wake-lock
COOL=1800
while true; do
  if python instagram_bot.py --check-panama --min-mag 2.5; then
    now=$(date +%s); last=$(cat .last_post 2>/dev/null || echo 0)
    if [ $((now-last)) -ge $COOL ]; then
      python ig_publish.py && echo $now > .last_post
    else
      echo "Cooldown: sismo omitido"
    fi
  fi
  sleep 900
done
