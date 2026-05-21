// Simple toast notification system
let toastContainer = null

function getContainer() {
  if (toastContainer && document.body.contains(toastContainer)) return toastContainer
  toastContainer = document.createElement('div')
  toastContainer.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 99999;
    display: flex;
    flex-direction: column;
    gap: 10px;
    pointer-events: none;
  `
  document.body.appendChild(toastContainer)
  return toastContainer
}

export function showToast(message, type = 'success', duration = 3000) {
  const container = getContainer()
  const toast = document.createElement('div')

  const colors = {
    success: { bg: '#00E676', text: '#000', icon: '✅' },
    error: { bg: '#FF1744', text: '#fff', icon: '❌' },
    info: { bg: '#2979FF', text: '#fff', icon: 'ℹ️' },
    warning: { bg: '#FFC107', text: '#000', icon: '⚠️' },
  }

  const color = colors[type] || colors.info
  toast.style.cssText = `
    background: ${color.bg};
    color: ${color.text};
    padding: 12px 20px;
    border-radius: 10px;
    font-family: 'Poppins', sans-serif;
    font-size: 14px;
    font-weight: 500;
    box-shadow: 0 4px 20px rgba(0,0,0,0.4);
    pointer-events: all;
    cursor: pointer;
    max-width: 320px;
    opacity: 0;
    transform: translateX(100%);
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 8px;
  `
  toast.innerHTML = `<span>${color.icon}</span><span>${message}</span>`
  container.appendChild(toast)

  requestAnimationFrame(() => {
    toast.style.opacity = '1'
    toast.style.transform = 'translateX(0)'
  })

  const remove = () => {
    toast.style.opacity = '0'
    toast.style.transform = 'translateX(100%)'
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast)
    }, 300)
  }

  toast.addEventListener('click', remove)
  setTimeout(remove, duration)
}
