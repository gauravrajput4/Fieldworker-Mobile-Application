document.addEventListener('DOMContentLoaded', () => {

    // Sidebar toggle
    const hamburger = document.getElementById('hamburger');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.getElementById('overlay');

    hamburger?.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        overlay.classList.toggle('show');
    });

    overlay?.addEventListener('click', () => {
        sidebar.classList.remove('open');
        overlay.classList.remove('show');
    });

    // Active nav
    const path = location.pathname;
    document.querySelectorAll('.nav-item').forEach(i => {
        if (i.getAttribute('href') === path) i.classList.add('active');
    });

    // Dark mode
    const toggle = document.getElementById('themeToggle');
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark');
    }

    toggle?.addEventListener('click', () => {
        document.body.classList.toggle('dark');
        localStorage.setItem(
            'theme',
            document.body.classList.contains('dark') ? 'dark' : 'light'
        );
    });

    // Chart
    const ctx = document.getElementById('dashboardChart');
    if (ctx) {
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Users','Farmers','Crops','Synced'],
                datasets: [{
                    data: [
                        STATS.totalUsers,
                        STATS.totalFarmers,
                        STATS.totalCrops,
                        STATS.syncedFarmers
                    ],
                    backgroundColor:['#2196f3','#4caf50','#ff9800','#9c27b0'],
                    borderRadius:8
                }]
            },
            options: {
                plugins:{ legend:{ display:false } },
                scales:{ y:{ beginAtZero:true } }
            }
        });
    }
});
