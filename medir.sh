#!/data/data/com.termux/files/usr/bin/bash
/usr/bin/time -v python instagram_bot.py --check-panama --min-mag 2.5 2>&1 | grep -E "Elapsed|Maximum resident"
