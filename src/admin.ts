type Kind = 'cars' | 'goods';
type Lang = 'ja' | 'si';
type Row = Record<string, any>;

const root = document.querySelector<HTMLDivElement>('#admin')!;
let kind: Kind = 'cars';
let rows: Row[] = [];
let editingRow: Row | undefined;
let lang: Lang = localStorage.getItem('mana-admin-lang') === 'si' ? 'si' : 'ja';

const messages = {
  ja: {
    pageTitle: 'マナエンタープライズ（株）在庫管理',
    publicSite: '公開サイト ↗',
    japanese: '日本語',
    sinhala: 'සිංහල',
    cars: '中古車',
    goods: '家具・家電',
    inventory: 'INVENTORY',
    newItem: '＋ 新規登録',
    loading: '読み込み中…',
    loadError: '在庫を読み込めませんでした。Accessの設定をご確認ください。',
    noItems: '登録された在庫はありません。',
    edit: '編集',
    delete: '削除',
    displayOrder: '表示順',
    editStock: '在庫を編集',
    newStock: '新規登録',
    name: '名称',
    category: 'カテゴリ',
    modelYear: '年式',
    mileage: '走行距離（km）',
    condition: '商品の状態',
    description: 'サイズ・説明',
    price: '価格（円）',
    status: '販売状態',
    imageNotice: '写真はJPEG・PNG・WebP。選択時に長辺1200px・品質75%へ圧縮し、1MB以下で保存します。',
    productImage: '商品写真（任意）',
    cancel: 'キャンセル',
    save: '保存して公開',
    forSale: '販売中',
    reserved: '売約済み',
    onHold: '取置中',
    sold: '販売済み',
    imageTooLarge: '圧縮後も1MBを超えています。別の画像を選んでください。',
    saveError: '保存できませんでした',
    deleteConfirm1: 'を削除しますか？',
    deleteConfirm2: 'この操作では対応する画像も削除されます。',
    deleteError: '削除できませんでした'
  },
  si: {
    pageTitle: 'මානා එන්ටර්ප්‍රයිස් තොග කළමනාකරණය',
    publicSite: 'පොදු වෙබ් අඩවිය ↗',
    japanese: '日本語',
    sinhala: 'සිංහල',
    cars: 'භාවිත කළ වාහන',
    goods: 'ගෘහ භාණ්ඩ හා විදුලි උපකරණ',
    inventory: 'තොගය',
    newItem: '＋ නව ලියාපදිංචිය',
    loading: 'පූරණය වෙමින් පවතී…',
    loadError: 'තොග දත්ත පූරණය කළ නොහැක. Access සැකසුම් පරීක්ෂා කරන්න.',
    noItems: 'ලියාපදිංචි කළ තොගයක් නොමැත.',
    edit: 'සංස්කරණය',
    delete: 'මකන්න',
    displayOrder: 'පෙන්වන අනුපිළිවෙල',
    editStock: 'තොගය සංස්කරණය කරන්න',
    newStock: 'නව ලියාපදිංචිය',
    name: 'නම',
    category: 'කාණ්ඩය',
    modelYear: 'නිෂ්පාදන වර්ෂය',
    mileage: 'ධාවන දුර (km)',
    condition: 'භාණ්ඩයේ තත්ත්වය',
    description: 'ප්‍රමාණය / විස්තරය',
    price: 'මිල (යෙන්)',
    status: 'විකුණුම් තත්ත්වය',
    imageNotice: 'JPEG, PNG හෝ WebP ඡායාරූප භාවිත කරන්න. තෝරාගත් විට දිගු පැත්ත 1200px සහ ගුණත්වය 75% ලෙස සම්පීඩනය කර 1MB ට අඩුවෙන් සුරකිනු ලැබේ.',
    productImage: 'භාණ්ඩ ඡායාරූපය (අත්‍යවශ්‍ය නොවේ)',
    cancel: 'අවලංගු කරන්න',
    save: 'සුරකින්න සහ ප්‍රකාශ කරන්න',
    forSale: 'විකිණීමට ඇත',
    reserved: 'වෙන් කර ඇත',
    onHold: 'තාවකාලිකව තබා ඇත',
    sold: 'විකුණා ඇත',
    imageTooLarge: 'සම්පීඩනයෙන් පසුවත් ගොනුව 1MB ඉක්මවයි. වෙනත් ඡායාරූපයක් තෝරන්න.',
    saveError: 'සුරැකිය නොහැකි විය',
    deleteConfirm1: 'මකා දැමිය යුතුද?',
    deleteConfirm2: 'මෙම ක්‍රියාවෙන් අදාළ ඡායාරූපයද මකා දමනු ලැබේ.',
    deleteError: 'මකා දැමිය නොහැකි විය'
  }
} as const;

function t<K extends keyof typeof messages.ja>(key: K): string {
  return messages[lang][key];
}

root.innerHTML = `
  <header class="top">
    <h1 id="pageTitle"></h1>
    <div class="top-actions">
      <div class="lang-switch" role="group" aria-label="Language">
        <button type="button" data-lang="ja">日本語</button>
        <button type="button" data-lang="si">සිංහල</button>
      </div>
      <a id="publicSite" href="/" target="_blank" rel="noopener"></a>
    </div>
  </header>

  <main class="wrap">
    <div class="tabs">
      <button data-kind="cars" class="active"></button>
      <button data-kind="goods"></button>
    </div>

    <section class="panel">
      <div class="toolbar">
        <div>
          <small id="inventoryLabel"></small>
          <h2 id="title"></h2>
        </div>
        <button class="primary" id="new"></button>
      </div>
      <div id="list"></div>
    </section>
  </main>

  <dialog id="modal">
    <form id="form">
      <h2 id="formTitle"></h2>
      <div id="fields"></div>
      <p class="notice" id="imageNotice"></p>
      <label>
        <span id="productImageLabel"></span>
        <input id="image" type="file" accept="image/jpeg,image/png,image/webp">
      </label>
      <div class="form-actions">
        <button type="button" id="cancel"></button>
        <button class="primary" id="saveButton"></button>
      </div>
    </form>
  </dialog>
`;

const listEl = document.querySelector<HTMLDivElement>('#list')!;
const modal = document.querySelector<HTMLDialogElement>('#modal')!;
const form = document.querySelector<HTMLFormElement>('#form')!;

const esc = (s: any) =>
  String(s ?? '').replace(/[&<>"']/g, c => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[c]!));

async function request<T = any>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init);
  if (!response.ok) throw Error(await response.text());
  return response.json() as Promise<T>;
}

function statusLabel(status: string): string {
  const map: Record<string, keyof typeof messages.ja> = {
    '販売中': 'forSale',
    '売約済み': 'reserved',
    '取置中': 'onHold',
    '販売済み': 'sold'
  };
  return map[status] ? t(map[status]) : status;
}

function applyLanguage() {
  document.documentElement.lang = lang === 'ja' ? 'ja' : 'si';
  document.title = t('pageTitle');

  document.querySelector('#pageTitle')!.textContent = t('pageTitle');
  document.querySelector('#publicSite')!.textContent = t('publicSite');
  document.querySelector('#inventoryLabel')!.textContent = t('inventory');
  document.querySelector('#title')!.textContent = kind === 'cars' ? t('cars') : t('goods');
  document.querySelector('#new')!.textContent = t('newItem');
  document.querySelector('#imageNotice')!.textContent = t('imageNotice');
  document.querySelector('#productImageLabel')!.textContent = t('productImage');
  document.querySelector('#cancel')!.textContent = t('cancel');
  document.querySelector('#saveButton')!.textContent = t('save');

  const carTab = document.querySelector<HTMLButtonElement>('[data-kind="cars"]')!;
  const goodsTab = document.querySelector<HTMLButtonElement>('[data-kind="goods"]')!;
  carTab.textContent = t('cars');
  goodsTab.textContent = t('goods');

  document.querySelectorAll<HTMLButtonElement>('[data-lang]').forEach(button => {
    button.classList.toggle('active', button.dataset.lang === lang);
  });

  if (modal.open) {
    document.querySelector('#formTitle')!.textContent = editingRow ? t('editStock') : t('newStock');
    document.querySelector('#fields')!.innerHTML = fields(editingRow);
  }

  render();
}

async function load() {
  listEl.textContent = t('loading');

  try {
    rows = await request<Row[]>(`/admin/api/${kind}`);
    render();
  } catch {
    listEl.innerHTML = `<p class="empty">${esc(t('loadError'))}</p>`;
  }
}

function imagePath(key: string) {
  return key.split('/').map(encodeURIComponent).join('/');
}

function render() {
  listEl.innerHTML = rows.length
    ? rows.map(row => `
      <div class="item">
        ${row.image_key
          ? `<img src="/images/${imagePath(row.image_key)}?v=2" alt="${esc(row.name)}">`
          : '<span class="thumb"></span>'}
        <div>
          <strong>${esc(row.name)}</strong>
          <p>${esc(row.category)}｜${esc(statusLabel(row.status))}｜${esc(t('displayOrder'))} ${esc(row.display_order)}</p>
        </div>
        <div class="actions">
          <button data-edit="${esc(row.id)}">${esc(t('edit'))}</button>
          <button class="danger" data-delete="${esc(row.id)}">${esc(t('delete'))}</button>
        </div>
      </div>
    `).join('')
    : `<p class="empty">${esc(t('noItems'))}</p>`;
}

function statusOptions(row: Row): string {
  const statuses = kind === 'cars'
    ? ['販売中', '売約済み', '販売済み']
    : ['販売中', '取置中', '販売済み'];

  return statuses.map(status =>
    `<option value="${status}" ${row.status === status ? 'selected' : ''}>${esc(statusLabel(status))}</option>`
  ).join('');
}

function fields(row: Row = {}) {
  const common = `
    <div class="form-grid">
      <label>
        ${esc(t('name'))} *
        <input name="name" required value="${esc(row.name)}">
      </label>
      <label>
        ${esc(t('category'))} *
        <input name="category" required value="${esc(row.category)}">
      </label>
  `;

  const kindFields = kind === 'cars'
    ? `
      <label>
        ${esc(t('modelYear'))}
        <input name="model_year" type="number" value="${esc(row.model_year)}">
      </label>
      <label>
        ${esc(t('mileage'))}
        <input name="mileage" type="number" value="${esc(row.mileage)}">
      </label>
    `
    : `
      <label>
        ${esc(t('condition'))}
        <input name="condition" value="${esc(row.condition)}">
      </label>
      <label>
        ${esc(t('description'))}
        <textarea name="description">${esc(row.description)}</textarea>
      </label>
    `;

  return common + kindFields + `
      <label>
        ${esc(t('price'))}
        <input name="price" type="number" min="0" required value="${esc(row.price || 0)}">
      </label>
      <label>
        ${esc(t('status'))}
        <select name="status">${statusOptions(row)}</select>
      </label>
      <label>
        ${esc(t('displayOrder'))}
        <input name="display_order" type="number" value="${esc(row.display_order || 0)}">
      </label>
    </div>
    <input type="hidden" name="id" value="${esc(row.id)}">
  `;
}

function openModal(row?: Row) {
  editingRow = row;
  document.querySelector('#formTitle')!.textContent = row ? t('editStock') : t('newStock');
  document.querySelector('#fields')!.innerHTML = fields(row);
  (document.querySelector('#image') as HTMLInputElement).value = '';
  modal.showModal();
}

async function compress(file: File) {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 1200 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');

  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

  const type =
    file.type === 'image/png'
      ? 'image/png'
      : file.type === 'image/webp'
        ? 'image/webp'
        : 'image/jpeg';

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(result => result ? resolve(result) : reject(), type, 0.75);
  });

  if (blob.size > 1024 * 1024) {
    throw Error(t('imageTooLarge'));
  }

  return blob;
}

form.addEventListener('submit', async event => {
  event.preventDefault();

  const formData = new FormData(form);
  const id = String(formData.get('id') || '');
  const data = Object.fromEntries(formData);
  delete data.id;

  try {
    const saved = await request(`/admin/api/${kind}${id ? `/${id}` : ''}`, {
      method: id ? 'PUT' : 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(data)
    });

    const file = (document.querySelector('#image') as HTMLInputElement).files?.[0];

    if (file) {
      const blob = await compress(file);
      await request(`/admin/api/upload/${kind}/${saved.id}`, {
        method: 'POST',
        headers: { 'content-type': blob.type },
        body: blob
      });
    }

    modal.close();
    editingRow = undefined;
    await load();
  } catch (error) {
    alert(`${t('saveError')}: ${error}`);
  }
});

root.addEventListener('click', async event => {
  const target = event.target as HTMLElement;

  if (target.dataset.lang === 'ja' || target.dataset.lang === 'si') {
    lang = target.dataset.lang;
    localStorage.setItem('mana-admin-lang', lang);
    applyLanguage();
    return;
  }

  if (target.dataset.kind) {
    kind = target.dataset.kind as Kind;

    document.querySelectorAll('.tabs button').forEach(button => {
      button.classList.toggle(
        'active',
        (button as HTMLElement).dataset.kind === kind
      );
    });

    document.querySelector('#title')!.textContent = kind === 'cars' ? t('cars') : t('goods');
    await load();
    return;
  }

  if (target.id === 'new') {
    openModal();
    return;
  }

  if (target.dataset.edit) {
    openModal(rows.find(row => String(row.id) === target.dataset.edit));
    return;
  }

  if (target.dataset.delete) {
    const row = rows.find(item => String(item.id) === target.dataset.delete);

    if (
      row &&
      confirm(`「${row.name}」${t('deleteConfirm1')}\n${t('deleteConfirm2')}`)
    ) {
      try {
        await request(`/admin/api/${kind}/${row.id}`, { method: 'DELETE' });
        await load();
      } catch {
        alert(t('deleteError'));
      }
    }

    return;
  }

  if (target.id === 'cancel') {
    modal.close();
    editingRow = undefined;
  }
});

modal.addEventListener('close', () => {
  editingRow = undefined;
});

applyLanguage();
load();
