import express from 'express';
import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);
const app = express();
app.use(express.json());

function formatWeiToUnits(weiString, decimals = 18) {
    try {
        const bigIntVal = BigInt(weiString);
        const divisor = BigInt(10 ** decimals);
        const integerPart = bigIntVal / divisor;
        const remainder = bigIntVal % divisor;
        const remainderStr = remainder.toString().padStart(decimals, '0').slice(0, 4);
        return `${integerPart.toLocaleString()}.${remainderStr}`;
    } catch (e) {
        return weiString;
    }
}

app.post('/webhook/whatsapp', async (req, res) => {
    try {
        const { message, sender } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Mensaje vacío' });
        }

        console.log(`[WHATSAPP] Consulta recibida de ${sender}: "${message}"`);

        const command = `npx baw exec "${message}"`;
        const { stdout, stderr } = await execPromise(command);

        let responseText = stdout || stderr;

        try {
            const jsonRes = JSON.parse(responseText);
            if (jsonRes.status === "1" && jsonRes.result) {
                const formattedBalance = formatWeiToUnits(jsonRes.result);
                responseText = `🤖 *SADV41 Agentic Wallet*\n\n*Estado:* OK\n*Balance:* ${formattedBalance} (Unidades/Tokens)`;
            }
        } catch (e) {
            // Manejo de respuesta en texto plano
        }

        res.status(200).json({
            recipient: sender,
            reply: responseText
        });

    } catch (error) {
        console.error('[ERROR AGENT]:', error.message);
        res.status(500).json({
            error: 'Error al procesar el comando en la terminal',
            details: error.message
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 WhatsApp Agentic Bridge activo en puerto ${PORT}`);
});
