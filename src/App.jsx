import { useState, useRef, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  // New states for image upload
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const fileInputRef = useRef(null)

  // Helper: Convert image URL to File object (for the original hero image)
  const urlToFile = async (url, filename) => {
    const response = await fetch(url)
    const blob = await response.blob()
    return new File([blob], filename, { type: blob.type })
  }

  // Handle image upload from user's device
  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Basic validation - only images
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (JPG, PNG, GIF, etc.)')
      return
    }

    // Revoke old preview URL to prevent memory leaks
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }

    const newPreviewUrl = URL.createObjectURL(file)
    setSelectedFile(file)
    setPreviewUrl(newPreviewUrl)
  }

  // Clean up object URL when component unmounts or preview changes
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  // Remove the uploaded image
  const handleRemoveImage = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setSelectedFile(null)
    setPreviewUrl(null)
    // Reset the hidden file input
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  // Unified share function (works for both hero image AND uploaded image)
  const handleShare = async () => {
    if (!navigator.share) {
      alert('Web Share API is not supported in this browser.\n\nTry on your mobile phone (Safari/Chrome) for the best experience!')
      return
    }

    try {
      let fileToShare = selectedFile

      if (!fileToShare) {
        // Fallback to the original hero image
        fileToShare = await urlToFile(heroImg, 'hero.png')
      }

      if (!navigator.canShare || !navigator.canShare({ files: [fileToShare] })) {
        throw new Error('Cannot share this file')
      }

      await navigator.share({
        title: selectedFile ? 'Check out my uploaded image!' : 'Check out this hero image!',
        text: 'Shared from my Vite + React app',
        files: [fileToShare],
      })
      console.log('✅ Shared successfully!')
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Share failed:', err)
        alert('Share was cancelled or failed.')
      }
    }
  }

  // Current image to display (uploaded or default hero)
  const currentImageSrc = previewUrl || heroImg

  return (
    <>
      <section id="center">
        <div className="hero">
          {/* Dynamic image: shows uploaded preview OR original hero.png */}
          <img
            src={currentImageSrc}
            className="base"
            width="170"
            height="179"
            alt={selectedFile ? 'Your uploaded image' : 'Hero image'}
          />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>

        <div>
          <h1>Get started</h1>
          <p>
            Edit <code>src/App.jsx</code> and save to test <code>HMR</code>
          </p>
        </div>

        <button
          type="button"
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>

        {/* === NEW: Image Upload Feature === */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          style={{
            marginTop: '20px',
            padding: '12px 24px',
            fontSize: '16px',
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          Upload your Image
        </button>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: 'none' }}
        />

        {/* Show file name + remove option when image is uploaded */}
        {selectedFile && (
          <div style={{ marginTop: '10px', textAlign: 'center' }}>
            <p style={{ fontSize: '14px', color: '#10b981', margin: '4px 0' }}>
              ✓ {selectedFile.name}
            </p>
            <button
              onClick={handleRemoveImage}
              style={{
                fontSize: '14px',
                color: '#ef4444',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              Remove image
            </button>
          </div>
        )}

        {/* Share Button - now works with uploaded image or falls back to hero */}
        <button
          type="button"
          onClick={handleShare}
          style={{
            marginTop: '20px',
            padding: '14px 28px',
            fontSize: '16px',
            backgroundColor: '#1877F2',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          📤 {selectedFile ? 'Share your uploaded image' : 'Share hero image to Facebook'}
        </button>

        <p style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
          {selectedFile
            ? 'Best on mobile — opens native share dialog with your image attached'
            : 'Best on mobile — opens native Facebook post screen with image attached'}
        </p>
      </section>

      <div className="ticks"></div>
      <section id="next-steps">
        <div id="docs">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#documentation-icon"></use>
          </svg>
          <h2>Documentation</h2>
          <p>Your questions, answered</p>
          <ul>
            <li>
              <a href="https://vite.dev/" target="_blank">
                <img className="logo" src={viteLogo} alt="" />
                Explore Vite
              </a>
            </li>
            <li>
              <a href="https://react.dev/" target="_blank">
                <img className="button-icon" src={reactLogo} alt="" />
                Learn more
              </a>
            </li>
          </ul>
        </div>
        <div id="social">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#social-icon"></use>
          </svg>
          <h2>Connect with us</h2>
          <p>Join the Vite community</p>
          <ul>
            <li>
              <a href="https://github.com/vitejs/vite" target="_blank">
                <svg className="button-icon" role="presentation" aria-hidden="true">
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                GitHub
              </a>
            </li>
            <li>
              <a href="https://chat.vite.dev/" target="_blank">
                <svg className="button-icon" role="presentation" aria-hidden="true">
                  <use href="/icons.svg#discord-icon"></use>
                </svg>
                Discord
              </a>
            </li>
            <li>
              <a href="https://x.com/vite_js" target="_blank">
                <svg className="button-icon" role="presentation" aria-hidden="true">
                  <use href="/icons.svg#x-icon"></use>
                </svg>
                X.com
              </a>
            </li>
            <li>
              <a href="https://bsky.app/profile/vite.dev" target="_blank">
                <svg className="button-icon" role="presentation" aria-hidden="true">
                  <use href="/icons.svg#bluesky-icon"></use>
                </svg>
                Bluesky
              </a>
            </li>
          </ul>
        </div>
      </section>
      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App

// import { useState, useRef, useEffect } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from './assets/vite.svg'
// import heroImg from './assets/hero.png'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   // New states for image upload
//   const [selectedFile, setSelectedFile] = useState(null)
//   const [previewUrl, setPreviewUrl] = useState(null)
//   const fileInputRef = useRef(null)

//   // Helper: Convert image URL to File object (for the original hero image)
//   const urlToFile = async (url, filename) => {
//     const response = await fetch(url)
//     const blob = await response.blob()
//     return new File([blob], filename, { type: blob.type })
//   }

//   // Handle image upload from user's device
//   const handleImageUpload = (e) => {
//     const file = e.target.files[0]
//     if (!file) return

//     // Basic validation - only images
//     if (!file.type.startsWith('image/')) {
//       alert('Please select a valid image file (JPG, PNG, GIF, etc.)')
//       return
//     }

//     // Revoke old preview URL to prevent memory leaks
//     if (previewUrl) {
//       URL.revokeObjectURL(previewUrl)
//     }

//     const newPreviewUrl = URL.createObjectURL(file)
//     setSelectedFile(file)
//     setPreviewUrl(newPreviewUrl)
//   }

//   // Clean up object URL when component unmounts or preview changes
//   useEffect(() => {
//     return () => {
//       if (previewUrl) {
//         URL.revokeObjectURL(previewUrl)
//       }
//     }
//   }, [previewUrl])

//   // Remove the uploaded image
//   const handleRemoveImage = () => {
//     if (previewUrl) URL.revokeObjectURL(previewUrl)
//     setSelectedFile(null)
//     setPreviewUrl(null)
//     if (fileInputRef.current) fileInputRef.current.value = ''
//   }

//   // Unified share function - now supports both normal post AND Story
//   const handleShare = async (isStory = false) => {
//     if (!navigator.share) {
//       alert('Web Share API is not supported in this browser.\n\nTry on your mobile phone (Safari/Chrome) for the best experience!')
//       return
//     }

//     try {
//       let fileToShare = selectedFile

//       if (!fileToShare) {
//         // Fallback to the original hero image
//         fileToShare = await urlToFile(heroImg, 'hero.png')
//       }

//       if (!navigator.canShare || !navigator.canShare({ files: [fileToShare] })) {
//         throw new Error('Cannot share this file')
//       }

//       const title = isStory 
//         ? 'Add this to your Facebook Story!' 
//         : (selectedFile ? 'Check out my uploaded image!' : 'Check out this hero image!')

//       const text = isStory 
//         ? 'Shared from my Vite + React app – perfect for Stories ✨' 
//         : 'Shared from my Vite + React app'

//       await navigator.share({
//         title,
//         text,
//         files: [fileToShare],
//       })
//       console.log('✅ Shared successfully!')
//     } catch (err) {
//       if (err.name !== 'AbortError') {
//         console.error('Share failed:', err)
//         alert('Share was cancelled or failed.')
//       }
//     }
//   }

//   // Current image to display (uploaded or default hero)
//   const currentImageSrc = previewUrl || heroImg

//   return (
//     <>
//       <section id="center">
//         <div className="hero">
//           <img
//             src={currentImageSrc}
//             className="base"
//             width="170"
//             height="179"
//             alt={selectedFile ? 'Your uploaded image' : 'Hero image'}
//           />
//           <img src={reactLogo} className="framework" alt="React logo" />
//           <img src={viteLogo} className="vite" alt="Vite logo" />
//         </div>

//         <div>
//           <h1>Get started</h1>
//           <p>
//             Edit <code>src/App.jsx</code> and save to test <code>HMR</code>
//           </p>
//         </div>

//         <button
//           type="button"
//           className="counter"
//           onClick={() => setCount((count) => count + 1)}
//         >
//           Count is {count}
//         </button>

//         {/* === Image Upload Feature === */}
//         <button
//           type="button"
//           onClick={() => fileInputRef.current?.click()}
//           style={{
//             marginTop: '20px',
//             padding: '12px 24px',
//             fontSize: '16px',
//             backgroundColor: '#10b981',
//             color: 'white',
//             border: 'none',
//             borderRadius: '8px',
//             cursor: 'pointer',
//             display: 'flex',
//             alignItems: 'center',
//             gap: '8px',
//           }}
//         >
//           📸 Upload your Image
//         </button>

//         <input
//           ref={fileInputRef}
//           type="file"
//           accept="image/*"
//           onChange={handleImageUpload}
//           style={{ display: 'none' }}
//         />

//         {selectedFile && (
//           <div style={{ marginTop: '10px', textAlign: 'center' }}>
//             <p style={{ fontSize: '14px', color: '#10b981', margin: '4px 0' }}>
//               ✓ {selectedFile.name}
//             </p>
//             <button
//               onClick={handleRemoveImage}
//               style={{
//                 fontSize: '14px',
//                 color: '#ef4444',
//                 background: 'none',
//                 border: 'none',
//                 cursor: 'pointer',
//                 textDecoration: 'underline',
//               }}
//             >
//               Remove image
//             </button>
//           </div>
//         )}

//         {/* === Share Buttons === */}
//         {/* Button 1: Normal Facebook Post */}
//         <button
//           type="button"
//           onClick={() => handleShare(false)}
//           style={{
//             marginTop: '20px',
//             padding: '14px 28px',
//             fontSize: '16px',
//             backgroundColor: '#1877F2',
//             color: 'white',
//             border: 'none',
//             borderRadius: '8px',
//             cursor: 'pointer',
//             display: 'flex',
//             alignItems: 'center',
//             gap: '8px',
//           }}
//         >
//           📤 Share to Facebook (Post)
//         </button>

//         {/* Button 2: Facebook Story (same Web Share API, better messaging) */}
//         <button
//           type="button"
//           onClick={() => handleShare(true)}
//           style={{
//             marginTop: '12px',
//             padding: '14px 28px',
//             fontSize: '16px',
//             backgroundColor: '#1877F2',
//             color: 'white',
//             border: 'none',
//             borderRadius: '8px',
//             cursor: 'pointer',
//             display: 'flex',
//             alignItems: 'center',
//             gap: '8px',
//           }}
//         >
//           📖 Share to Facebook Story
//         </button>

//         <p style={{ marginTop: '10px', fontSize: '14px', color: '#666', textAlign: 'center' }}>
//           Best on mobile — opens native share dialog → choose Facebook → then select <strong>Story</strong> ✨
//         </p>
//       </section>

//       <div className="ticks"></div>
//       <section id="next-steps">
//         <div id="docs">
//           <svg className="icon" role="presentation" aria-hidden="true">
//             <use href="/icons.svg#documentation-icon"></use>
//           </svg>
//           <h2>Documentation</h2>
//           <p>Your questions, answered</p>
//           <ul>
//             <li>
//               <a href="https://vite.dev/" target="_blank">
//                 <img className="logo" src={viteLogo} alt="" />
//                 Explore Vite
//               </a>
//             </li>
//             <li>
//               <a href="https://react.dev/" target="_blank">
//                 <img className="button-icon" src={reactLogo} alt="" />
//                 Learn more
//               </a>
//             </li>
//           </ul>
//         </div>
//         <div id="social">
//           <svg className="icon" role="presentation" aria-hidden="true">
//             <use href="/icons.svg#social-icon"></use>
//           </svg>
//           <h2>Connect with us</h2>
//           <p>Join the Vite community</p>
//           <ul>
//             <li>
//               <a href="https://github.com/vitejs/vite" target="_blank">
//                 <svg className="button-icon" role="presentation" aria-hidden="true">
//                   <use href="/icons.svg#github-icon"></use>
//                 </svg>
//                 GitHub
//               </a>
//             </li>
//             <li>
//               <a href="https://chat.vite.dev/" target="_blank">
//                 <svg className="button-icon" role="presentation" aria-hidden="true">
//                   <use href="/icons.svg#discord-icon"></use>
//                 </svg>
//                 Discord
//               </a>
//             </li>
//             <li>
//               <a href="https://x.com/vite_js" target="_blank">
//                 <svg className="button-icon" role="presentation" aria-hidden="true">
//                   <use href="/icons.svg#x-icon"></use>
//                 </svg>
//                 X.com
//               </a>
//             </li>
//             <li>
//               <a href="https://bsky.app/profile/vite.dev" target="_blank">
//                 <svg className="button-icon" role="presentation" aria-hidden="true">
//                   <use href="/icons.svg#bluesky-icon"></use>
//                 </svg>
//                 Bluesky
//               </a>
//             </li>
//           </ul>
//         </div>
//       </section>
//       <div className="ticks"></div>
//       <section id="spacer"></section>
//     </>
//   )
// }

// export default App