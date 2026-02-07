module.exports = {
    apps: [
        {
            name: "yoga-bac",
            script: "index.js", // ⬅️ change ONLY if your entry file is app.js/server.js
            instances: 1,       // keep 1 unless you know cluster mode implications
            autorestart: true,
            watch: false,
            max_memory_restart: "300M",

            env: {
                NODE_ENV: "production",
                PORT: 8000,

                // ✅ Database
                DATABASE_URL:
                    "mysql://sern_user:Sern%402025%23Mysql%21@localhost:3306/sern_db",

                // ✅ Auth
                JWT_SECRET: "jkfjdskajfojo",

                // ✅ Razorpay
                KEY_ID: "rzp_live_RCINP7qteB4dX1",
                KEY_SECRET: "HyKizra1Ben2K3JwZixWi6UM",

                // ✅ URLs
                BASE_URL: "http://yogsaathi.com/assets",
                BASE_URL_INVOICE: "http://yogsaathi.com",
                CLASS_BASE_URL: "http://yogsaathi.com",

                // ✅ WhatsApp
                WHASTAPP_API:
                    "15fa2ce18fcc924d167aa3c40d0e4730:402cb6d73f369a822d288b5494fbd374868d0f640c9ce9ee8c0ac822091b9f5bcc5bff29f1522fac7c54dbeebdf1a1a244177b891d5a36262ccea99c3f89bfd231cfefa1182ffdd8534165190c937195234b4e211b7c81bf14401dd8d5bfa0d16abf9cf6fb4bb3ba3706a5d777152b6032705b0e992e6bc1d9f0bd7857e7d34ad25a81d3dd4f1a633fa8c4abaadab23f9b2308dce696731a2af52c539080b79f397a7379732662f262c0e7088faf4c3d0e29c73e648c1e17945c2e6a0383c15e",

                // ✅ Email
                EMAIL_ID: "samarths716@gmail.com",
                EMAIL_KEY: "uxou hwwj uztz nixi"
            }
        }
    ]
};
