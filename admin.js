const SUPABASE_URL = 'https://YOUR_PROJECT.supabase.co';
const SUPABASE_KEY = 'YOUR_PUBLIC_ANON_KEY';
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const list = document.getElementById('productList');
const form = document.getElementById('addProductForm');

async function fetchProducts() {
  const { data } = await supabase.from('products').select('*');
  list.innerHTML = '';
  data.forEach(p => {
    const li = document.createElement('li');
    li.textContent = `${p.barcode} - ${p.name}`;
    const del = document.createElement('button');
    del.textContent = '🗑️';
    del.onclick = () => deleteProduct(p.id);
    li.appendChild(del);
    list.appendChild(li);
  });
}

form.onsubmit = async (e) => {
  e.preventDefault();
  const barcode = document.getElementById('barcode').value;
  const name = document.getElementById('name').value;
  await supabase.from('products').insert([{ barcode, name }]);
  form.reset();
  fetchProducts();
};

async function deleteProduct(id) {
  await supabase.from('products').delete().eq('id', id);
  fetchProducts();
}

fetchProducts();
