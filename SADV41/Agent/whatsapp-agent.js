import express from 'express';
import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);
const app = express();
app.use(express.json());

const BAW_BIN = process.env.PREFIX ? `${process.env.PREFIX}/bin/baw` : 'baw';

app.post('/webhook/whatsapp', async (req, res) => {
    try {
        const { message, sender } = req.body;
        if (!message) return res.status(400).json({ error: 'Mensaje vacío' });

        console.log(`[WHATSAPP] Consulta recibida de ${sender}: "${message}"`);

        const msgLower = message.toLowerCase().trim();
        let command = `${BAW_BIN} wallet balance --json`;

        if (msgLower.includes('address') || msgLower.includes('direccion')) {
            command = `${BAW_BIN} wallet address --json`;
        } else if (msgLower.includes('status') || msgLower.includes('estado')) {
            command = `${BAW_BIN} wallet status --json`;
        }

        const { stdout, stderr } = await execPromise(command);
        let responseText = stdout || stderr;

        try {
            const jsonRes = JSON.parse(responseText);
            if (jsonRes.success && Array.isArray(jsonRes.data)) {
                let totalUSD = 0;
                let assetList = jsonRes.data.map(item => {
                    const val = parseFloat(item.value || 0);
                    totalUSD += val;
                    return `• *${item.symbol}*: ${item.balance} ($${val.toFixed(2)} USD)`;
                }).join('\n');

                responseText = `🤖 *stevendior.ai | Agentic Wallet*\n\n${assetList}\n\n💵 *Valor Total Est.:* $${totalUSD.toFixed(2)} USD`;
            } else {
                responseText = `🤖 *stevendior.ai | Agentic Wallet*\n\n\`\`\`${JSON.stringify(jsonRes, null, 2)}\`\`\``;
            }
        } catch (e) {
            // Fallback para texto plano
        }

        res.status(200).json({ recipient: sender, reply: responseText });
    } catch (error) {
        console.error('[ERROR AGENT]:', error.message);
        res.status(500).json({ error: 'Error al procesar comando', details: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 WhatsApp Agentic Bridge activo en puerto ${PORT}`));
