import { useRef } from 'react'

export function ImagePattern({ onImageLoad, isActive }) {
  const fileInputRef = useRef(null)

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        onImageLoad(img)
      }
      img.src = e.target?.result
    }
    reader.readAsDataURL(file)
  }

  const handleClear = () => {
    if (fileInputRef.current) fileInputRef.current.value = ''
    onImageLoad(null)
  }

  return (
    <div className="image-pattern-compact">
      <label className="controls-label">IMAGE PATTERN</label>
      <div className="image-upload-compact">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="image-input-compact"
          title="Upload image for particles to match"
        />
        <button className="upload-button-compact" onClick={() => fileInputRef.current?.click()}>📸</button>
        {isActive && (
          <button className="clear-button-compact" onClick={handleClear} title="Clear image">✕</button>
        )}
      </div>
      {isActive && <div className="image-status-compact">Image loaded</div>}
    </div>
  )
}

