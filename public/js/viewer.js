// Show toast function
function showToast(message, toastClass) {
    const toastElement = document.getElementById('toast-notification');
    const toastBody = document.getElementById('toast-message');
    toastBody.textContent = message;
    toastElement.className = `toast align-items-center text-white ${toastClass} border-0`;

    const toast = new bootstrap.Toast(toastElement, {
        autohide: true,
        delay: 3000
    });

    toast.show();
}

// Frontend JS for removing options from watchlist
document.addEventListener('DOMContentLoaded', () => {
    // Save the active tab in localStorage when clicked
    const tabLinks = document.querySelectorAll('#tabs a[data-bs-toggle="tab"]')
    tabLinks.forEach(tab => {
        tab.addEventListener('shown.bs.tab', (event) => {
            const activeTabId = event.target.id; // e.g., 'movie-tab' or 'tv-tab'
            localStorage.setItem('activeTab', activeTabId)
        })
    })

    // Restore the active tab on page load
    const activeTabId = localStorage.getItem('activeTab')
    if (activeTabId) {
        const activeTab = document.getElementById(activeTabId)
        if (activeTab) {
            const bootstrapTab = new bootstrap.Tab(activeTab)
            bootstrapTab.show()
        }
    }

    // Handle remove button clicks
    const removeButtons = document.querySelectorAll('.remove-button')
    removeButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const itemId = button.dataset.id
            const type = button.dataset.type
            console.log('Attempting to remove:', itemId, type)
            removeFromWatchlist(itemId, type)
        })
    })
})

async function removeFromWatchlist(itemId, type) {
    console.log('Attempting to remove:', itemId, type)
    try {
        const response = await fetch('/watchlist/remove', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ itemId, type }), // Pass both itemId (movieId or tvShowId) and type
        });

        if (!response.ok) {
            console.error('Error response from server:', response.status)
            const text = await response.text();
            console.error('Response body:', text);
            showToast('Error removing item from watchlist', 'bg-danger')
            return
        }

        const data = await response.json()
        showToast(data.message, 'bg-success') // Show success toast
        location.reload() // Reload to reflect changes
    } catch (error) {
        console.error('Error removing from watchlist:', error)
        showToast('Failed to remove from watchlist', 'bg-danger') // Show error toast
    }
}