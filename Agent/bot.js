import makeWASocket, { useMultiFileAuthState, DisconnectReason } from '@whiskeysockets/baileys';
import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);
const BAW_BIN = process.env.PREFIX ? `${process.env.PREFIX}/bin/baw` : 'baw';

async function main() {
    const { state, saveCreds } = await useMultiFileAuthState('baileys_auth');
    const sock = makeWASocket.default({
        auth: state,
        printQRInTerminal: true
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            const reconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
            if (reconnect) main();
        } else if (connection === 'open') {
            console.log('🚀 Agente SADV41 activo en WhatsApp (Sin Túnel)');
        }
    });

    sock.ev.on('messages.upsert', async ({ messages, type }) => {
        if (type !== 'notify') return;
        for (const msg of messages) {
            if (!msg.message || msg.key.fromMe) continue;
            
            const text = (msg.message.conversation || msg.message.extendedTextMessage?.text || '').toLowerCase().trim();
            const sender = msg.key.remoteJid;

            if (text.includes('balance') || text.includes('saldo')) {
                console.log(`[WA] Procesando balance para ${sender}...`);
                try {
                    const { stdout } = await execPromise(`${BAW_BIN} wallet balance --json`);
                    const jsonRes = JSON.parse(stdout);
                    
                    if (jsonRes.success && Array.isArray(jsonRes.data)) {
                        let totalUSD = 0;
                        let list = jsonRes.data.map(i => {
                            const val = parseFloat(i.value || 0);
                            totalUSD += val;
                            return `• *${i.symbol}*: ${i.balance} ($${val.toFixed(2)} USD)`;
                        }).join('\n');

                        await sock.sendMessage(sender, { 
                            text: `🤖 *stevendior.ai | Agentic Wallet*\n\n${list}\n\n💵 *Total Est.:* $${totalUSD.toFixed(2)} USD` 
                        });
                    }
                } catch (err) {
                    await sock.sendMessage(sender, { text: '❌ Error al consultar la wallet local.' });
                }
            }
        }
    });
}

main();
