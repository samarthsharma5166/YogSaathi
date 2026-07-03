const axios = require('axios');
const fs = require('fs');

async function downloadInvoice() {
    const response = await axios.post(
        'http://localhost:8000/generateInvoice',
        {
            invoiceNo: 'INV-2026-0001',
            planName: 'Saver Package',
            name: 'Sanjeev Agarwal',
            email: '',
            startDate: '2026-07-01',
            expiresAt: '2026-07-31',
            referralDays: 0,
            finalEndDate: '2026-07-31',
            isIndian: true,
            price: 1499,
        },
        { responseType: 'arraybuffer' }
    );

    fs.writeFileSync('invoice.pdf', response.data);
    console.log('Invoice saved to invoice.pdf');
}

downloadInvoice().catch(console.error);