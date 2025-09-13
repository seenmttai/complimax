document.addEventListener('DOMContentLoaded', () => {
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false
    });

    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    
    hamburger?.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    document.querySelectorAll('.navbar-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href.length > 1) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });

    const scrollProgress = document.getElementById('scroll-progress');
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        if (scrollProgress) {
            scrollProgress.style.width = scrollPercent + '%';
        }
    });

    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallax = document.querySelector('#hero');
        if (parallax) {
            parallax.style.backgroundPositionY = (scrolled * 0.5) + 'px';
        }
    });

    document.getElementById('quoteForm')?.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        const requiredFields = ['name', 'email', 'phone', 'country', 'service', 'consultation'];
        const missingFields = requiredFields.filter(field => !data[field]);
        if (missingFields.length > 0) {
            alert('Please fill in all required fields: ' + missingFields.join(', '));
            return;
        }
        const message = `Hello CompliMax! I'd like to request a quote:\n\nName: ${data.name}\n${data.business ? `Business: ${data.business}\n` : ''}Email: ${data.email}\nPhone: ${data.phone}\nCountry: ${data.country}\nService Needed: ${data.service}\nPreferred Consultation: ${data.consultation}\n${data.message ? `Message: ${data.message}` : ''}`;
        const encodedMessage = encodeURIComponent(message);
        const whatsappURL = `https://wa.me/918905209197?text=${encodedMessage}`;
        window.open(whatsappURL, '_blank');
        this.reset();
        alert('Thank you! Your quote request has been sent. We\'ll contact you shortly.');
    });

    const blogGridHome = document.querySelector('#blog .blog-grid');
    const blogGridPage = document.getElementById('blog-listing-grid');
    if (blogGridHome || blogGridPage) {
        loadBlogs();
    }
});

async function loadBlogs() {
    try {
        const response = await fetch('metadata-blog.csv');
        if (!response.ok) throw new Error('Network response was not ok');
        const csvText = await response.text();
        const blogs = parseCSV(csvText);

        const blogGridHome = document.querySelector('#blog .blog-grid');
        if (blogGridHome) {
            displayBlogs(blogs.slice(0, 3), blogGridHome);
            const exploreBtnContainer = document.querySelector('.blog-btn-container');
            if(exploreBtnContainer) {
                exploreBtnContainer.innerHTML = `<a href="blog.html" class="btn btn-secondary">Explore All Articles</a>`;
            }
        }

        const blogGridPage = document.getElementById('blog-listing-grid');
        if (blogGridPage) {
            displayBlogs(blogs, blogGridPage);
        }
    } catch (error) {
        console.error('Failed to load blogs:', error);
        const blogGridHome = document.querySelector('#blog .blog-grid');
        if(blogGridHome) blogGridHome.innerHTML = '<p style="text-align:center;">Could not load blog posts. Please try again later.</p>';
        const blogGridPage = document.getElementById('blog-listing-grid');
        if(blogGridPage) blogGridPage.innerHTML = '<p style="text-align:center;">Could not load blog posts. Please try again later.</p>';
    }
}

function displayBlogs(blogs, container) {
    container.innerHTML = '';
    if (blogs.length === 0) {
        container.innerHTML = '<p style="text-align:center;">No blog posts found.</p>';
        return;
    }
    blogs.forEach((blog, index) => {
        const blogCard = document.createElement('div');
        blogCard.className = 'blog-card';
        blogCard.setAttribute('data-aos', 'fade-up');
        blogCard.setAttribute('data-aos-delay', (index % 3 + 1) * 100);
        blogCard.innerHTML = createBlogCardHTML(blog);
        container.appendChild(blogCard);
    });
}

function createBlogCardHTML(blog) {
    return `
        <div class="blog-card-content">
            <span class="tag">${blog.tag || 'General'}</span>
            <h4><a href="${blog.link}">${blog.title}</a></h4>
            <p class="blog-summary">${blog.summary || ''}</p>
            <div class="date">${blog.date || ''}</div>
        </div>
    `;
}

function parseCSV(text) {
    const lines = text.trim().replace(/\r/g, '').split('\n');
    if (lines.length < 2) return [];
    const headers = lines[0].split(',').map(h => h.trim());
    const rows = [];
    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        if (values.length !== headers.length) continue;
        const row = {};
        for (let j = 0; j < headers.length; j++) {
            let value = values[j].trim();
            if (value.startsWith('"') && value.endsWith('"')) {
                value = value.slice(1, -1).replace(/""/g, '"');
            }
            row[headers[j]] = value;
        }
        rows.push(row);
    }
    return rows;
}