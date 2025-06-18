const SUPABASE_URL = 'https://YOUR_PROJECT.supabase.co';
const SUPABASE_KEY = 'YOUR_PUBLIC_ANON_KEY';
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

function startScanner() {
  Quagga.init({
    inputStream: {
      name: "Live",
      type: "LiveStream",
      target: document.querySelector('#scanner'),
      constraints: { facingMode: "environment" }
    },
    decoder: { readers: ["ean_reader", "code_128_reader", "upc_reader"] }
  }, err => {
    if (err) return console.error(err);
    Quagga.start();
  });

  Quagga.onDetected(async data => {
    const code = data.codeResult.code;
    Quagga.stop();

    const now = new Date();

    const { data: product } = await supabase
      .from('products')
      .select('*')
      .eq('barcode', code)
      .single();

    const productName = product ? product.name : "Not Found";

    const entry = {
      barcode: code,
      product: productName,
      date: now.toLocaleDateString(),
      time: now.toLocaleTimeString()
    };

    await supabase.from('scan_logs').insert([entry]);

    document.getElementById('result').innerText =
      `Scanned: ${code}\nProduct: ${productName}\nTime: ${entry.time}`;

    setTimeout(() => Quagga.start(), 2000);
  });
}

window.onload = startScanner;
