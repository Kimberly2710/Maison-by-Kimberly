import { useState } from 'react'
import axios from 'axios'

const CAT_LABELS = {
  dresses: 'Dresses',
  tops: 'Tops',
  'crop-tops': 'Crop Tops',
  'boho-skirts': 'Skirt / Boho Skirts',
  trousers: 'Trousers',
  palazzo: 'Palazzo / Official',
  jumpsuit: 'Jumpsuit',
  jumpshorts: 'Jumpshorts',
  shoes: 'Shoes',
}

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')

  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [userSessions, setUserSessions] = useState([])
  const [toast, setToast] = useState('')
  const [currentTab, setCurrentTab] = useState('products')

  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [price, setPrice] = useState('')
  const [size, setSize] = useState('')
  const [description, setDescription] = useState('')
  const [frontImageFile, setFrontImageFile] = useState(null)
  const [backImageFile, setBackImageFile] = useState(null)
  const [videoFile, setVideoFile] = useState(null)
  const [videoUrl, setVideoUrl] = useState('')
  const [frontPreview, setFrontPreview] = useState(null)
  const [backPreview, setBackPreview] = useState(null)
  const [videoPreview, setVideoPreview] = useState(null)
  const [editingProductId, setEditingProductId] = useState(null)
  const [isNewArrival, setIsNewArrival] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [slideItems, setSlideItems] = useState([])
  const [slideLabel, setSlideLabel] = useState('')
  const [slideTitle, setSlideTitle] = useState('')
  const [slideDescription, setSlideDescription] = useState('')
  const [slideActionText, setSlideActionText] = useState('')
  const [slideActionLink, setSlideActionLink] = useState('/shop')
  const [slideAltText, setSlideAltText] = useState('')
  const [slideImageFile, setSlideImageFile] = useState(null)
  const [slidePreview, setSlidePreview] = useState(null)
  const [editingSlideId, setEditingSlideId] = useState(null)
  const [slideSubmitting, setSlideSubmitting] = useState(false)

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  function resetForm() {
    setEditingProductId(null)
    setName('')
    setCategory('')
    setPrice('')
    setSize('')
    setDescription('')
    setFrontImageFile(null)
    setBackImageFile(null)
    setVideoFile(null)
    setVideoUrl('')
    setFrontPreview(null)
    setBackPreview(null)
    setVideoPreview(null)
    setIsNewArrival(false)
  }

  function resetSlideForm() {
    setEditingSlideId(null)
    setSlideLabel('')
    setSlideTitle('')
    setSlideDescription('')
    setSlideActionText('')
    setSlideActionLink('/shop')
    setSlideAltText('')
    setSlideImageFile(null)
    setSlidePreview(null)
  }

  function handleEditProduct(product) {
    setEditingProductId(product.id)
    setName(product.name || '')
    setCategory(product.category || '')
    setPrice(product.price || '')
    setSize(product.size || '')
    setDescription(product.description || '')
    setIsNewArrival(!!product.is_new_arrival)
    setFrontImageFile(null)
    setBackImageFile(null)
    setVideoFile(null)
    setVideoUrl(product.video_url || '')
    setFrontPreview(product.front_image ? `/uploads/${product.front_image}` : product.image ? `/uploads/${product.image}` : null)
    setBackPreview(product.back_image ? `/uploads/${product.back_image}` : null)
    setVideoPreview(product.video_file ? `/uploads/${product.video_file}` : product.video_url || null)
  }

  function handleCancelEdit() {
    resetForm()
  }

  async function handleLogin(e) {
    e.preventDefault()
    try {
      const res = await axios.post('/api/auth/login', { username, password })
      if (res.data.success) {
        setIsLoggedIn(true)
        setLoginError('')
        fetchProducts()
        fetchSlides()
        fetchOperationalData()
      }
    } catch {
      setLoginError('Incorrect username or password')
    }
  }

  async function fetchProducts() {
    try {
      const res = await axios.get('/api/products')
      setProducts(res.data)
    } catch {
      setProducts([])
    }
  }

  async function fetchSlides() {
    try {
      const res = await axios.get('/api/homepage/slides')
      setSlideItems(res.data)
    } catch {
      setSlideItems([])
    }
  }

  async function fetchOperationalData() {
    const [ordersResponse, usersResponse] = await Promise.allSettled([
      axios.get('/api/admin/orders'),
      axios.get('/api/admin/users'),
    ])
    setOrders(ordersResponse.status === 'fulfilled' ? ordersResponse.value.data : [])
    setUserSessions(usersResponse.status === 'fulfilled' ? usersResponse.value.data : [])
  }

  async function updateOrderStatus(orderId, status) {
    try {
      const response = await axios.put(`http://localhost:5000/api/admin/orders/${orderId}/status`, { status })
      if (response.status === 200 && response.data.success) {
        setOrders(currentOrders => currentOrders.map(order => order.id === orderId ? { ...order, status } : order))
        showToast('Order status updated')
      }
    } catch {
      showToast('Unable to update order status')
    }
  }

  function handleFrontImageChange(e) {
    const file = e.target.files[0]
    if (!file) return
    setFrontImageFile(file)
    setFrontPreview(URL.createObjectURL(file))
  }

  function handleBackImageChange(e) {
    const file = e.target.files[0]
    if (!file) return
    setBackImageFile(file)
    setBackPreview(URL.createObjectURL(file))
  }

  function handleVideoFileChange(e) {
    const file = e.target.files[0]
    if (!file) return
    setVideoFile(file)
    setVideoPreview(URL.createObjectURL(file))
  }

  function handleSlideImageChange(e) {
    const file = e.target.files[0]
    if (!file) return
    setSlideImageFile(file)
    setSlidePreview(URL.createObjectURL(file))
  }

  async function handleSaveProduct(e) {
    e.preventDefault()
    if (!name || !category || !price) {
      showToast('Please fill in name, category and price')
      return
    }
    setSubmitting(true)

    const formData = new FormData()
    formData.append('name', name)
    formData.append('category', category)
    formData.append('price', price)
    formData.append('size', size)
    formData.append('description', description)
    formData.append('is_new_arrival', isNewArrival ? '1' : '0')
    if (frontImageFile) formData.append('front_image', frontImageFile)
    if (backImageFile) formData.append('back_image', backImageFile)
    if (videoFile) formData.append('video_file', videoFile)
    if (videoUrl.trim()) formData.append('video_url', videoUrl.trim())

    try {
      if (editingProductId) {
        await axios.put(`/api/products/${editingProductId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        showToast('✦ Item updated successfully')
      } else {
        await axios.post('/api/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        showToast('✦ Item added to shop!')
      }

      resetForm()
      fetchProducts()
    } catch {
      showToast(editingProductId ? 'Error updating item. Try again.' : 'Error adding product. Try again.')
    }
    setSubmitting(false)
  }

  async function handleSaveSlide(e) {
    e.preventDefault()
    if (!slideTitle || (!slideImageFile && !slidePreview)) {
      showToast('Please add a slide title and image')
      return
    }
    setSlideSubmitting(true)

    const formData = new FormData()
    formData.append('label', slideLabel)
    formData.append('title', slideTitle)
    formData.append('description', slideDescription)
    formData.append('action_text', slideActionText)
    formData.append('action_link', slideActionLink)
    formData.append('alt_text', slideAltText)
    if (slideImageFile) formData.append('image', slideImageFile)

    try {
      if (editingSlideId) {
        await axios.put(`/api/homepage/slides/${editingSlideId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        showToast('✦ Slide updated successfully')
      } else {
        await axios.post('/api/homepage/slides', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        showToast('✦ Slide added successfully')
      }
      resetSlideForm()
      fetchSlides()
    } catch {
      showToast(editingSlideId ? 'Error updating slide.' : 'Error adding slide.')
    }
    setSlideSubmitting(false)
  }

  async function handleEditSlide(slide) {
    setEditingSlideId(slide.id)
    setSlideLabel(slide.label || '')
    setSlideTitle(slide.title || '')
    setSlideDescription(slide.description || '')
    setSlideActionText(slide.action_text || '')
    setSlideActionLink(slide.action_link || '/shop')
    setSlideAltText(slide.alt_text || '')
    setSlideImageFile(null)
    setSlidePreview(slide.image ? `/uploads/${slide.image}` : null)
  }

  async function handleDeleteSlide(id) {
    if (!window.confirm('Remove this slide?')) return
    try {
      await axios.delete(`/api/homepage/slides/${id}`)
      showToast('Slide removed.')
      fetchSlides()
    } catch {
      showToast('Error removing slide.')
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Remove this item from the shop?')) return
    try {
      await axios.delete(`/api/products/${id}`)
      showToast('Item removed.')
      fetchProducts()
    } catch {
      showToast('Error removing item.')
    }
  }

  async function handleMarkSold(id) {
    if (!window.confirm('Mark this item as sold?')) return
    try {
      await axios.put(`/api/products/${id}`, { sold: true })
      showToast('Item marked as sold')
      fetchProducts()
    } catch {
      showToast('Error marking item as sold')
    }
  }

  // LOGIN SCREEN
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-blush flex items-center justify-center px-4">
        <div className="bg-white border border-blush-border rounded-2xl p-12 w-full max-w-sm text-center shadow-sm">
          <p className="font-script text-5xl text-wine mb-1">Maison by Kimberly</p>
          <p className="text-[11px] tracking-[4px] uppercase text-rose mb-8">Admin Panel</p>
          <form onSubmit={handleLogin} className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-blush-border rounded-xl bg-blush text-wine-deep text-sm outline-none focus:border-wine transition-colors"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-blush-border rounded-xl bg-blush text-wine-deep text-sm outline-none focus:border-wine transition-colors"
            />
            {loginError && (
              <p className="text-red-500 text-xs mt-1">{loginError}</p>
            )}
            <button
              type="submit"
              className="w-full py-3 bg-wine text-white rounded-xl text-sm font-medium tracking-widest uppercase hover:bg-wine-deep transition-colors mt-2"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    )
  }

  // ADMIN DASHBOARD
  return (
    <div className="flex flex-col min-h-screen bg-blush">
      {/* Admin Nav */}
      <div className="bg-white border-b border-blush-border px-8 py-4 flex items-center justify-between">
        <p className="font-script text-3xl text-wine">Maison by Kimberly</p>
        <div className="flex items-center gap-5">
          <a href="/" target="_blank" rel="noreferrer"
            className="text-xs text-wine font-medium tracking-wide hover:underline">
            View Site ↗
          </a>
          <button
            onClick={() => setIsLoggedIn(false)}
            className="border border-wine text-wine text-xs px-4 py-2 rounded-full hover:bg-wine hover:text-white transition-all"
          >
            Log Out
          </button>
        </div>
      </div>

      <nav className="w-full flex items-center justify-start gap-4 px-8 py-4 bg-transparent border-b border-white/10 mb-6" aria-label="Admin sections">
        {[
          ['products', 'Product Studio'],
          ['media', 'Media and Banner Manager'],
          ['orders', 'Order Fullfillment'],
        ].map(([tab, label]) => (
          <button
            key={tab}
            type="button"
            onClick={() => setCurrentTab(tab)}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${currentTab === tab ? 'border-b-2 border-wine text-wine' : 'text-wine-light hover:text-wine'}`}
            aria-current={currentTab === tab ? 'page' : undefined}
          >
            {label}
          </button>
        ))}
      </nav>

      <main className="w-full px-8 flex-1">
      <div className="w-full px-0 py-10">
        <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-2xl font-medium text-wine-deep">Admin Workspace</h1>
            <p className="text-sm text-wine-light mt-1">Manage the Maison catalogue, homepage, and live orders.</p>
          </div>
        </div>

        {currentTab === 'products' && (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-8">

          {/* ADD PRODUCT FORM */}
          <div className="bg-white border border-blush-border rounded-2xl p-7">
            <h2 className="text-base font-semibold text-wine-deep mb-6">✦ Add New Piece</h2>
            <form onSubmit={handleSaveProduct} className="flex flex-col gap-4">

              <div>
                <div className="flex items-center justify-between gap-4">
                  <label className="block text-[11px] font-semibold text-wine uppercase tracking-[0.5px] mb-1.5">Item Name</label>
                  {editingProductId && (
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="text-xs uppercase tracking-[2px] text-wine/70 hover:text-wine transition-colors"
                    >
                      Cancel edit
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  placeholder="e.g. Ivory Linen Midi Dress"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-blush-border rounded-xl bg-blush text-wine-deep text-sm outline-none focus:border-wine transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-wine uppercase tracking-[0.5px] mb-1.5">Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-blush-border rounded-xl bg-blush text-wine-deep text-sm outline-none focus:border-wine transition-colors"
                >
                  <option value="">Select category</option>
                  <option value="dresses">Dresses</option>
                  <option value="tops">Tops</option>
                  <option value="crop-tops">Crop Tops</option>
                  <option value="boho-skirts">Skirt / Boho Skirts</option>
                  <option value="trousers">Trousers</option>
                  <option value="palazzo">Palazzo / Official Pants</option>
                  <option value="jumpsuit">Jumpsuit</option>
                  <option value="jumpshorts">Jumpshorts</option>
                  <option value="shoes">Shoes</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-wine uppercase tracking-[0.5px] mb-1.5">Price (KSh)</label>
                  <input
                    type="number"
                    placeholder="e.g. 1500"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    className="w-full px-4 py-3 border border-blush-border rounded-xl bg-blush text-wine-deep text-sm outline-none focus:border-wine transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-wine uppercase tracking-[0.5px] mb-1.5">Size</label>
                  <input
                    type="text"
                    placeholder="e.g. S, M, UK10"
                    value={size}
                    onChange={e => setSize(e.target.value)}
                    className="w-full px-4 py-3 border border-blush-border rounded-xl bg-blush text-wine-deep text-sm outline-none focus:border-wine transition-colors"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  id="newArrival"
                  type="checkbox"
                  checked={isNewArrival}
                  onChange={e => setIsNewArrival(e.target.checked)}
                  className="h-4 w-4 text-wine border-blush-border rounded focus:ring-wine"
                />
                <label htmlFor="newArrival" className="text-sm text-wine-deep font-medium">
                  Mark as New Arrival
                </label>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-wine uppercase tracking-[0.5px] mb-1.5">Description</label>
                <textarea
                  placeholder="Describe the piece — fabric, condition, styling tips..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-blush-border rounded-xl bg-blush text-wine-deep text-sm outline-none focus:border-wine transition-colors resize-y"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-wine uppercase tracking-[0.5px] mb-1.5">Product video</label>
                <input
                  type="text"
                  placeholder="Paste a video URL (YouTube, MP4, etc.)"
                  value={videoUrl}
                  onChange={e => setVideoUrl(e.target.value)}
                  className="w-full px-4 py-3 border border-blush-border rounded-xl bg-blush text-wine-deep text-sm outline-none focus:border-wine transition-colors mb-3"
                />
                <label className="block border-2 border-dashed border-blush-border rounded-xl p-6 text-center cursor-pointer hover:border-rose transition-colors bg-blush">
                  {videoPreview ? (
                    <video src={videoPreview} controls className="max-h-48 mx-auto rounded-lg w-full object-cover" />
                  ) : (
                    <>
                      <span className="text-3xl block mb-2">🎬</span>
                      <span className="text-xs text-wine-light">Upload a product video</span>
                    </>
                  )}
                  <input type="file" accept="video/*" onChange={handleVideoFileChange} className="hidden" />
                </label>
                <p className="text-[11px] text-wine-light mt-2">Add a video link or upload an MP4/WebM file.</p>
              </div>

              {/* Photo Upload */}
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-wine uppercase tracking-[0.5px] mb-1.5">Front view</label>
                  <label className="block border-2 border-dashed border-blush-border rounded-xl p-6 text-center cursor-pointer hover:border-rose transition-colors bg-blush">
                    {frontPreview ? (
                      <img src={frontPreview} alt="front preview" className="max-h-40 mx-auto rounded-lg object-cover" />
                    ) : (
                      <>
                        <span className="text-3xl block mb-2">📷</span>
                        <span className="text-xs text-wine-light">Upload front view</span>
                      </>
                    )}
                    <input type="file" accept="image/*" onChange={handleFrontImageChange} className="hidden" />
                  </label>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-wine uppercase tracking-[0.5px] mb-1.5">Back view</label>
                  <label className="block border-2 border-dashed border-blush-border rounded-xl p-6 text-center cursor-pointer hover:border-rose transition-colors bg-blush">
                    {backPreview ? (
                      <img src={backPreview} alt="back preview" className="max-h-40 mx-auto rounded-lg object-cover" />
                    ) : (
                      <>
                        <span className="text-3xl block mb-2">📷</span>
                        <span className="text-xs text-wine-light">Upload back view</span>
                      </>
                    )}
                    <input type="file" accept="image/*" onChange={handleBackImageChange} className="hidden" />
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-wine text-white rounded-xl text-sm font-medium tracking-widest uppercase hover:bg-wine-deep transition-colors disabled:opacity-60 mt-1"
              >
                {submitting ? (editingProductId ? 'Saving...' : 'Adding...') : (editingProductId ? 'Save changes' : 'Add to Shop ✦')}
              </button>
            </form>
          </div>

          {/* PRODUCT LIST */}
          <div className="bg-white border border-blush-border rounded-2xl p-7">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base font-semibold text-wine-deep">Current Inventory</h2>
              <span className="text-xs text-wine-light">
                {products.length} piece{products.length !== 1 ? 's' : ''}
              </span>
            </div>

            {products.length === 0 ? (
              <div className="text-center py-16 text-wine-light text-sm">
                No pieces yet. Add your first item! 
              </div>
            ) : (
              <div className="flex flex-col gap-3 max-h-[600px] overflow-y-auto pr-1">
                {products.map(p => (
                  <div key={p.id} className={`flex gap-4 items-center p-3 rounded-xl border border-blush-border ${p.sold ? 'bg-rose/10' : 'bg-blush'}`}>
                    {p.image ? (
                      <img
                        src={`/uploads/${p.image}`}
                        alt={p.name}
                        className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-lg bg-blush-mid flex items-center justify-center text-xl flex-shrink-0">
                        
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-wine-deep truncate">{p.name}</p>
                      <p className="text-xs text-wine-light mt-0.5">
                        {CAT_LABELS[p.category] || p.category} · Size: {p.size || 'N/A'}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-wine whitespace-nowrap">
                      KSh {Number(p.price).toLocaleString()}
                    </span>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleEditProduct(p)}
                        className="border border-wine text-wine text-xs px-3 py-1.5 rounded-lg hover:bg-wine hover:text-white transition-all"
                      >
                        Edit
                      </button>
                      {p.sold ? (
                        <span className="text-xs text-rose uppercase">Sold</span>
                      ) : (
                        <button
                          onClick={() => handleMarkSold(p.id)}
                          className="border border-wine text-wine text-xs px-3 py-1.5 rounded-lg hover:bg-wine hover:text-white transition-all"
                        >
                          Mark Sold
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="border border-blush-border text-rose text-xs px-3 py-1.5 rounded-lg hover:bg-blush-mid hover:border-rose transition-all flex-shrink-0"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          </div>
        )}

        {currentTab === 'media' && (
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-8">
          <div className="bg-white border border-blush-border rounded-2xl p-7">
            <h2 className="text-base font-semibold text-wine-deep mb-6">✦ Slide Manager</h2>
            <form onSubmit={handleSaveSlide} className="flex flex-col gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-wine uppercase tracking-[0.5px] mb-1.5">Slide label</label>
                <input
                  type="text"
                  placeholder="Short section label"
                  value={slideLabel}
                  onChange={e => setSlideLabel(e.target.value)}
                  className="w-full px-4 py-3 border border-blush-border rounded-xl bg-blush text-wine-deep text-sm outline-none focus:border-wine transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-wine uppercase tracking-[0.5px] mb-1.5">Headline</label>
                <input
                  type="text"
                  placeholder="Slide headline"
                  value={slideTitle}
                  onChange={e => setSlideTitle(e.target.value)}
                  className="w-full px-4 py-3 border border-blush-border rounded-xl bg-blush text-wine-deep text-sm outline-none focus:border-wine transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-wine uppercase tracking-[0.5px] mb-1.5">Description</label>
                <textarea
                  placeholder="Short supporting copy"
                  value={slideDescription}
                  onChange={e => setSlideDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-blush-border rounded-xl bg-blush text-wine-deep text-sm outline-none focus:border-wine transition-colors resize-y"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-[11px] font-semibold text-wine uppercase tracking-[0.5px] mb-1.5">Action text</label>
                  <input
                    type="text"
                    placeholder="e.g. Shop the Edit"
                    value={slideActionText}
                    onChange={e => setSlideActionText(e.target.value)}
                    className="w-full px-4 py-3 border border-blush-border rounded-xl bg-blush text-wine-deep text-sm outline-none focus:border-wine transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-wine uppercase tracking-[0.5px] mb-1.5">Action link</label>
                  <input
                    type="text"
                    placeholder="/shop or external URL"
                    value={slideActionLink}
                    onChange={e => setSlideActionLink(e.target.value)}
                    className="w-full px-4 py-3 border border-blush-border rounded-xl bg-blush text-wine-deep text-sm outline-none focus:border-wine transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-wine uppercase tracking-[0.5px] mb-1.5">Image alt text</label>
                <input
                  type="text"
                  placeholder="Describe the image for screen readers"
                  value={slideAltText}
                  onChange={e => setSlideAltText(e.target.value)}
                  className="w-full px-4 py-3 border border-blush-border rounded-xl bg-blush text-wine-deep text-sm outline-none focus:border-wine transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-wine uppercase tracking-[0.5px] mb-1.5">Slide image</label>
                <label className="block border-2 border-dashed border-blush-border rounded-xl p-6 text-center cursor-pointer hover:border-rose transition-colors bg-blush">
                  {slidePreview ? (
                    <img src={slidePreview} alt="slide preview" className="max-h-40 mx-auto rounded-lg object-cover" />
                  ) : (
                    <>
                      <span className="text-3xl block mb-2">📷</span>
                      <span className="text-xs text-wine-light">Upload an image for the slide</span>
                    </>
                  )}
                  <input type="file" accept="image/*" onChange={handleSlideImageChange} className="hidden" />
                </label>
              </div>

              <div className="flex items-center gap-3">
                {editingSlideId && (
                  <button
                    type="button"
                    onClick={resetSlideForm}
                    className="text-xs uppercase tracking-[2px] text-wine/70 hover:text-wine transition-colors"
                  >
                    Cancel edit
                  </button>
                )}
                <button
                  type="submit"
                  disabled={slideSubmitting}
                  className="ml-auto py-3.5 px-6 bg-wine text-white rounded-xl text-sm font-medium tracking-widest uppercase hover:bg-wine-deep transition-colors disabled:opacity-60"
                >
                  {slideSubmitting ? (editingSlideId ? 'Saving...' : 'Adding...') : (editingSlideId ? 'Update Slide' : 'Add Slide')}
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white border border-blush-border rounded-2xl p-7">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base font-semibold text-wine-deep">Slides</h2>
              <span className="text-xs text-wine-light">{slideItems.length} total</span>
            </div>
            {slideItems.length === 0 ? (
              <div className="text-center py-16 text-wine-light text-sm">
                No slides yet. Add a new slide to update the homepage carousel.
              </div>
            ) : (
              <div className="space-y-3">
                {slideItems.map(slide => (
                  <div key={slide.id} className="flex flex-col gap-3 rounded-2xl border border-blush-border bg-blush p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-20 h-20 rounded-lg overflow-hidden bg-white">
                        <img
                          src={slide.image?.startsWith('/uploads/') ? slide.image : `/uploads/${slide.image}`}
                          alt={slide.alt_text || slide.title || 'Slide image'}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-wine-deep truncate">{slide.title}</p>
                        <p className="text-xs text-wine-light mt-1 truncate">{slide.label || 'Homepage slide'}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => handleEditSlide(slide)}
                        className="px-3 py-1.5 border border-wine text-wine text-xs rounded-full hover:bg-wine hover:text-white transition-all"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteSlide(slide.id)}
                        className="px-3 py-1.5 border border-rose text-rose text-xs rounded-full hover:bg-rose/10 transition-all"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          </div>
        )}

        {currentTab === 'orders' && (
          <section className="mt-10 grid gap-8 lg:grid-cols-[1.5fr_0.8fr]">
          <div className="overflow-hidden rounded-2xl border border-blush-border bg-white p-7">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-base font-semibold text-wine-deep">Order Monitor</h2>
              <span className="text-xs text-wine-light">{orders.length} transaction{orders.length === 1 ? '' : 's'}</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-xs">
                <thead className="border-b border-blush-border text-[10px] uppercase tracking-wider text-wine-light">
                  <tr>
                    <th className="px-3 py-3">Order ID</th>
                    <th className="px-3 py-3">Customer Email</th>
                    <th className="px-3 py-3">Telephone</th>
                    <th className="px-3 py-3">Delivery Coordinates</th>
                    <th className="px-3 py-3">Total Bill</th>
                    <th className="px-3 py-3">Payment State</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blush-border text-wine-deep">
                  {orders.map(order => (
                    <tr key={order.id}>
                      <td className="px-3 py-3 font-semibold">#{order.id}</td>
                      <td className="px-3 py-3">{order.email}</td>
                      <td className="px-3 py-3">{order.phone_number}</td>
                      <td className="max-w-[220px] px-3 py-3">{order.delivery_address}</td>
                      <td className="whitespace-nowrap px-3 py-3">KSh {Number(order.total_amount).toLocaleString()}</td>
                      <td className="px-3 py-3">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className={order.status === 'pending'
                            ? 'bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs font-bold border border-amber-200'
                            : order.status === 'Complete' || order.status === 'Delivered'
                              ? 'bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold border border-emerald-200'
                              : 'bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-bold border border-slate-200'}
                          >
                            {order.status || 'pending'}
                          </span>
                          <select
                            value={order.status || 'pending'}
                            onChange={event => updateOrderStatus(order.id, event.target.value)}
                            className="rounded-lg border border-blush-border bg-white px-2 py-1 text-xs font-semibold text-wine-deep"
                            aria-label={`Update status for order ${order.id}`}
                          >
                            <option value="pending">Pending</option>
                            <option value="Complete">Complete</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!orders.length && <p className="py-8 text-center text-sm text-wine-light">No transactions recorded yet.</p>}
            </div>
          </div>

          <div className="rounded-2xl border border-blush-border bg-white p-7">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-base font-semibold text-wine-deep">Active User Authentications</h2>
              <span className="text-xs text-wine-light">{userSessions.length}</span>
            </div>
            <div className="space-y-3">
              {userSessions.map(session => (
                <div key={session.id || `${session.user_id}-${session.authenticated_at}`} className="rounded-xl bg-blush px-4 py-3">
                  <p className="truncate text-sm font-semibold text-wine-deep">{session.email}</p>
                  <p className="mt-1 text-xs text-wine-light">User ID: {session.user_id}</p>
                  <p className="mt-1 text-xs text-wine-light">{new Date(session.authenticated_at).toLocaleString()}</p>
                </div>
              ))}
              {!userSessions.length && <p className="py-8 text-center text-sm text-wine-light">No authentications recorded yet.</p>}
            </div>
          </div>
          </section>
        )}
      </div>
      </main>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-wine text-white text-sm px-6 py-3 rounded-full shadow-lg z-50">
          {toast}
        </div>
      )}
    </div>
  )
}