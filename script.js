async function loadSharedChrome() {
  try {
    const base = window.location.pathname.includes('/blogs/') ? '../' : './';
    const res = await fetch(`${base}index.html`);
    if (!res.ok) throw new Error('Failed to fetch index.html');
    const html = await res.text();

    const doc = new DOMParser().parseFromString(html, 'text/html');

    const nav = doc.querySelector('#header > nav');
    if (nav) {
      const header = document.getElementById('header');
      header.innerHTML = '';
      header.appendChild(nav.cloneNode(true));

      const hamburger = document.getElementById('hamburger');
      const navLinks = document.getElementById('nav-links');
      hamburger?.addEventListener('click', () => navLinks.classList.toggle('active'));
    }

    const footContainer = doc.querySelector('#footer > .container');
    if (footContainer) {
      const footer = document.getElementById('footer');
      footer.innerHTML = '';
      footer.appendChild(footContainer.cloneNode(true));
    }
  } catch (e) {
    console.error('Failed to load shared components:', e);
  }
}

document.addEventListener('DOMContentLoaded', () => {
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false
    });

    if (document.body.id !== 'homepage') {
        loadSharedChrome();
    } else {
        const hamburger = document.getElementById('hamburger');
        const navLinks = document.getElementById('nav-links');
        hamburger?.addEventListener('click', () => navLinks.classList.toggle('active'));
    }

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

    const blogGridHome = document.querySelector('#blog .blog-grid');
    const blogGridPage = document.getElementById('blog-listing-grid');
    if (blogGridHome || blogGridPage) {
        loadBlogs();
    }
});

async function loadBlogs() {
    try {
        const response = await fetch('metadata-blog.json'); 
        if (!response.ok) throw new Error('Network response was not ok');
        
        const { posts } = await response.json(); 

        const blogGridHome = document.querySelector('#blog .blog-grid');
        if (blogGridHome) {
            displayBlogs(posts.slice(0, 3), blogGridHome);
            const exploreBtnContainer = document.querySelector('.blog-btn-container');
            if(exploreBtnContainer) {
                exploreBtnContainer.innerHTML = `<a href="blog.html" class="btn btn-secondary">Explore All Articles</a>`;
            }
        }

        const blogGridPage = document.getElementById('blog-listing-grid');
        if (blogGridPage) {
            displayBlogs(posts, blogGridPage);
        }
    } catch (error) {
        console.error('Failed to load blogs:', error);
        const blogContainer = document.querySelector('#blog .blog-grid, #blog-listing-grid');
        if(blogContainer) blogContainer.innerHTML = '<p style="text-align:center; width: 100%;">Could not load blog posts. Please try again later.</p>';
    }
}

function displayBlogs(blogs, container) {
    container.innerHTML = '';
    if (!blogs || blogs.length === 0) {
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