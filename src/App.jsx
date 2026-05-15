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
//     // Reset the hidden file input
//     if (fileInputRef.current) fileInputRef.current.value = ''
//   }

//   // Unified share function (works for both hero image AND uploaded image)
//   const handleShare = async () => {
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

//       await navigator.share({
//         title: selectedFile ? 'Check out my uploaded image!' : 'Check out this hero image!',
//         text: 'Shared from my Vite + React app',
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
//           {/* Dynamic image: shows uploaded preview OR original hero.png */}
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

//         {/* === NEW: Image Upload Feature === */}
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
//           Upload your Image
//         </button>

//         {/* Hidden file input */}
//         <input
//           ref={fileInputRef}
//           type="file"
//           accept="image/*"
//           onChange={handleImageUpload}
//           style={{ display: 'none' }}
//         />

//         {/* Show file name + remove option when image is uploaded */}
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

//         {/* Share Button - now works with uploaded image or falls back to hero */}
//         <button
//           type="button"
//           onClick={handleShare}
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
//           📤 {selectedFile ? 'Share your uploaded image' : 'Share hero image to Facebook'}
//         </button>

//         <p style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
//           {selectedFile
//             ? 'Best on mobile — opens native share dialog with your image attached'
//             : 'Best on mobile — opens native Facebook post screen with image attached'}
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



// import { useState, useRef, useEffect } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from './assets/vite.svg'
// import heroImg from './assets/hero.png'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)
//   const [selectedFile, setSelectedFile] = useState(null)
//   const [previewUrl, setPreviewUrl] = useState(null)
//   const [showFBInstructions, setShowFBInstructions] = useState(false)
//   const [showDirectAttempt, setShowDirectAttempt] = useState(false)
  
//   const fileInputRef = useRef(null)

//   const urlToFile = async (url, filename) => {
//     const response = await fetch(url)
//     const blob = await response.blob()
//     return new File([blob], filename, { type: blob.type })
//   }

//   const handleImageUpload = (e) => {
//     const file = e.target.files[0]
//     if (!file || !file.type.startsWith('image/')) {
//       alert('Please select a valid image file')
//       return
//     }
//     if (previewUrl) URL.revokeObjectURL(previewUrl)
//     const newPreviewUrl = URL.createObjectURL(file)
//     setSelectedFile(file)
//     setPreviewUrl(newPreviewUrl)
//   }

//   useEffect(() => {
//     return () => {
//       if (previewUrl) URL.revokeObjectURL(previewUrl)
//     }
//   }, [previewUrl])

//   const handleRemoveImage = () => {
//     if (previewUrl) URL.revokeObjectURL(previewUrl)
//     setSelectedFile(null)
//     setPreviewUrl(null)
//     if (fileInputRef.current) fileInputRef.current.value = ''
//   }

//   // General Share (Instagram Story works best)
//   const handleGeneralShare = async () => {
//     if (!navigator.share) {
//       alert('Please open this on your mobile browser')
//       return
//     }
//     try {
//       let fileToShare = selectedFile || await urlToFile(heroImg, 'hero.png')
//       await navigator.share({
//         title: 'My Story',
//         text: 'Shared from React App',
//         files: [fileToShare],
//       })
//     } catch (err) {
//       if (err.name !== 'AbortError') console.error(err)
//     }
//   }

//   // === NEW: Try Direct Facebook Stories Deep Link ===
//   const handleDirectFacebookStory = async () => {
//     let fileToDownload = selectedFile
//     if (!fileToDownload) {
//       fileToDownload = await urlToFile(heroImg, 'story-image.png')
//     }

//     // 1. Download image first (required step)
//     const url = URL.createObjectURL(fileToDownload)
//     const a = document.createElement('a')
//     a.href = url
//     a.download = selectedFile ? selectedFile.name : 'my-story.png'
//     document.body.appendChild(a)
//     a.click()
//     document.body.removeChild(a)
//     URL.revokeObjectURL(url)

//     // 2. Try to open Facebook Stories directly
//     setTimeout(() => {
//       try {
//         // Official deep link for Facebook Stories
//         window.location.href = 'facebook-stories://share'
        
//         // Alternative attempts (in case above doesn't work)
//         setTimeout(() => {
//           if (document.hidden === false) { // If still on same tab
//             window.open('fb://faceweb/f?href=https://www.facebook.com/stories/create', '_blank')
//           }
//         }, 800)
//       } catch (e) {
//         console.log('Deep link failed')
//       }
//     }, 600)

//     setShowDirectAttempt(true)
//   }

//   const currentImageSrc = previewUrl || heroImg

//   return (
//     <>
//       <section id="center">
//         <div className="hero">
//           <img src={currentImageSrc} className="base" width="170" height="179" alt="Preview" />
//           <img src={reactLogo} className="framework" alt="React logo" />
//           <img src={viteLogo} className="vite" alt="Vite logo" />
//         </div>

//         <div>
//           <h1>Get started</h1>
//           <p>Edit <code>src/App.jsx</code> and save to test <code>HMR</code></p>
//         </div>

//         <button type="button" className="counter" onClick={() => setCount(c => c + 1)}>
//           Count is {count}
//         </button>

//         <button
//           type="button"
//           onClick={() => fileInputRef.current?.click()}
//           style={{ marginTop: '20px', padding: '12px 24px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '8px' }}
//         >
//           📸 Upload your Image
//         </button>

//         <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />

//         {selectedFile && (
//           <div style={{ marginTop: '10px', textAlign: 'center' }}>
//             <p style={{ color: '#10b981' }}>✓ {selectedFile.name}</p>
//             <button onClick={handleRemoveImage} style={{ color: '#ef4444' }}>Remove</button>
//           </div>
//         )}

//         <button onClick={handleGeneralShare} style={{ marginTop: '25px', padding: '14px 28px', background: '#1877F2', color: 'white', border: 'none', borderRadius: '8px', width: '100%', maxWidth: '320px' }}>
//           📤 Share (Best for Instagram Story)
//         </button>

//         <button 
//           onClick={handleDirectFacebookStory} 
//           style={{ 
//             marginTop: '12px', 
//             padding: '14px 28px', 
//             background: '#1877F2', 
//             color: 'white', 
//             border: 'none', 
//             borderRadius: '8px', 
//             width: '100%', 
//             maxWidth: '320px',
//             fontWeight: '600'
//           }}
//         >
//           📖 Try Direct Facebook Story
//         </button>

//         <p style={{ marginTop: '15px', fontSize: '14px', color: '#666', textAlign: 'center' }}>
//           First button = Reliable for Instagram<br />
//           Second button = Attempts direct FB Story (needs FB app installed)
//         </p>
//       </section>

//       {/* Direct Attempt Modal */}
//       {showDirectAttempt && (
//         <div style={{
//           position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
//           background: 'rgba(0,0,0,0.9)', zIndex: 10000,
//           display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
//         }}>
//           <div style={{ background: 'white', borderRadius: '20px', padding: '30px', maxWidth: '400px', textAlign: 'center' }}>
//             <h2>Image Downloaded + Opening Facebook...</h2>
//             <p style={{ margin: '20px 0', fontSize: '16px' }}>
//               If Facebook Stories composer didn't open automatically:<br /><br />
//               1. Open Facebook App manually<br />
//               2. Tap <strong>+ Create Story</strong><br />
//               3. Select the downloaded image from Gallery
//             </p>
//             <button 
//               onClick={() => setShowDirectAttempt(false)}
//               style={{ padding: '14px 40px', background: '#1877F2', color: 'white', border: 'none', borderRadius: '50px', fontSize: '16px' }}
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Your existing sections... */}
//       <div className="ticks"></div>
//       <section id="next-steps">
//         {/* ... keep your original content ... */}
//       </section>
//     </>
//   )
// }

// export default App


import { useState, useRef, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [isIOS, setIsIOS] = useState(false)
  const [showHelp, setShowHelp] = useState(false)

  const fileInputRef = useRef(null)

  // Detect iOS
  useEffect(() => {
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                (navigator.platform === 'MacIntel' && 'ontouchend' in document)
    setIsIOS(iOS)
  }, [])

  const urlToFile = async (url, filename = 'story-image.png') => {
    const response = await fetch(url)
    const blob = await response.blob()
    return new File([blob], filename, { type: blob.type })
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (!file || !file.type.startsWith('image/')) {
      alert('Please select a valid image file')
      return
    }
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setSelectedFile(file)
    setPreviewUrl(URL.createObjectURL(file))
  }

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const handleRemoveImage = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setSelectedFile(null)
    setPreviewUrl(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  // === MAIN SHARE BUTTON (Best for iOS) ===
  const handleShareToStory = async () => {
    if (!navigator.share) {
      alert("Please open this on your iPhone Safari for best experience.")
      return
    }

    try {
      let fileToShare = selectedFile
      if (!fileToShare) {
        fileToShare = await urlToFile(heroImg, 'my-story-image.png')
      }

      // This opens native iOS share sheet
      await navigator.share({
        title: 'My Story',
        text: 'Check out my story!',
        files: [fileToShare],
      })

      console.log('Share sheet opened successfully')
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error(err)
        // Fallback: show manual instructions
        setShowHelp(true)
      }
    }
  }

  const currentImageSrc = previewUrl || heroImg

  return (
    <>
      <section id="center">
        <div className="hero">
          <img
            src={currentImageSrc}
            className="base"
            width="170"
            height="179"
            alt="Preview"
          />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>

        <div>
          <h1>Get started</h1>
          <p>Edit <code>src/App.jsx</code> and save to test <code>HMR</code></p>
        </div>

        <button type="button" className="counter" onClick={() => setCount(c => c + 1)}>
          Count is {count}
        </button>

        <button
          onClick={() => fileInputRef.current?.click()}
          style={{ marginTop: '20px', padding: '12px 24px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '8px' }}
        >
          📸 Upload your Image
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: 'none' }}
        />

        {selectedFile && (
          <div style={{ marginTop: '10px', textAlign: 'center' }}>
            <p style={{ color: '#10b981' }}>✓ {selectedFile.name}</p>
            <button onClick={handleRemoveImage} style={{ color: '#ef4444' }}>Remove</button>
          </div>
        )}

        {/* MAIN BUTTON - This is the best you can get */}
        <button
          onClick={handleShareToStory}
          style={{
            marginTop: '30px',
            padding: '16px 32px',
            fontSize: '18px',
            backgroundColor: '#1877F2',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            width: '100%',
            maxWidth: '340px',
            fontWeight: '600'
          }}
        >
          📤 Share to Facebook / Instagram Story
        </button>

        <p style={{ marginTop: '15px', fontSize: '14px', color: '#555', textAlign: 'center' }}>
          {isIOS 
            ? "On iPhone: Tap 'Facebook' or 'Save Image' in the share sheet" 
            : "Works best on mobile — opens native share sheet"}
        </p>
      </section>

      {/* Help Modal */}
      {showHelp && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 10000,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }}>
          <div style={{ background: 'white', borderRadius: '20px', padding: '25px', maxWidth: '420px', textAlign: 'center' }}>
            <h2>How to Add to Facebook Story</h2>
            <ol style={{ textAlign: 'left', lineHeight: '2.2', fontSize: '16px' }}>
              <li>Image is ready in share sheet</li>
              <li>Tap <strong>Facebook</strong> (or Save Image first)</li>
              <li>Facebook will open in Story mode</li>
              <li>Edit &amp; post your story</li>
            </ol>
            <button 
              onClick={() => setShowHelp(false)}
              style={{ marginTop: '20px', padding: '14px 40px', background: '#1877F2', color: 'white', border: 'none', borderRadius: '50px' }}
            >
              Got it
            </button>
          </div>
        </div>
      )}

      <div className="ticks"></div>
      <section id="next-steps">
        {/* your other sections */}
      </section>
    </>
  )
}

export default App
