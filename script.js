const SUPABASE_URL = 'https://iycqbldwoqjotbtjxbwh.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5Y3FibGR3b3Fqb3RidGp4YndoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMTY5OTIsImV4cCI6MjA2NTc5Mjk5Mn0.FYiexhuek1YgF6hpIJeBrRbcq3xu1ORPmikWSLDsL-M';
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

function startScanner() {
  Quagga.init({
    inputStream: {
      name: "Live",
      type: "LiveStream",
      target: document.querySelector('#scanner'),
      constraints: {
        facingMode: "environment"
      }
    },
    decoder: {
      readers: ["ean_reader", "code_128_reader", "upc_reader"]
    }
  }, err => {
    if (err) {
      console.error("Scanner initialization error:", err);
      return;
    }
    Quagga.start();
  });

  Quagga.onDetected(async data => {
    const code = data.codeResult.code;
    console.log("🔍 Detected:", code);
    Quagga.stop();

    document.getElementById('result').innerText = `Scanned: ${code}`;

    const res = await fetch('/scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ barcode: code })
    });

    const result = await res.json();

    document.getElementById('result').innerText =
      `Scanned: ${result.data.Barcode}\nProduct: ${result.data.Product}\nTime: ${result.data.Time}`;

    setTimeout(() => Quagga.start(), 2000);
  });
}


window.onload = startScanner;
