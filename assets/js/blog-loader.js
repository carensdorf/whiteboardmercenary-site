// Format date from YYYY-MM-DD to Month DD, YYYY
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Load a single blog post
async function loadBlogPost() {
    try {
        const response = await fetch('blog-posts.json');
        const data = await response.json();
        
        // Get post ID from URL
        const postId = window.location.pathname.split('/').pop().replace('.html', '');
        console.log('Looking for post with ID:', postId);
        console.log('Available posts:', data.posts.map(p => p.id));
        
        // Try to find the post by ID
        let post = data.posts.find(p => p.id === postId);
        
        // If not found, try to match by filename pattern
        if (!post) {
            console.log('Post not found by exact ID, trying pattern matching...');
            // Handle the case where filename is longer than the ID
            post = data.posts.find(p => postId.includes(p.id) || p.id.includes(postId));
        }
        
        if (!post) {
            console.error('Post not found for ID:', postId);
            console.log('Available post IDs:', data.posts.map(p => p.id));
            return;
        }

        console.log('Found post:', post.title);

        // Update meta tags
        document.title = `${post.title} | Whiteboard Mercenary`;
        document.querySelector('meta[name="description"]').setAttribute('content', post.excerpt);
        
        // Update Open Graph tags
        document.querySelector('meta[property="og:title"]').setAttribute('content', post.title);
        document.querySelector('meta[property="og:description"]').setAttribute('content', post.excerpt);
        document.querySelector('meta[property="og:image"]').setAttribute('content', `https://whiteboardmercenary.com/${post.image}`);
        document.querySelector('meta[property="og:url"]').setAttribute('content', `https://whiteboardmercenary.com/${postId}.html`);
        
        // Update Twitter Card tags
        document.querySelector('meta[name="twitter:title"]').setAttribute('content', post.title);
        document.querySelector('meta[name="twitter:description"]').setAttribute('content', post.excerpt);
        document.querySelector('meta[name="twitter:image"]').setAttribute('content', `https://whiteboardmercenary.com/${post.image}`);

        // Update blog content
        const blogImg = document.querySelector('.blog-img img');
        blogImg.src = post.image;
        blogImg.alt = post.title;

        const blogMeta = document.querySelector('.blog-meta');
        blogMeta.innerHTML = `
            <li><i class="fa fa-calendar-check-o"></i> ${formatDate(post.date)}</li>
            <li><i class="fa fa-user-o"></i> ${post.author}</li>
            <li><i class="fa fa-book"></i> <a href="#">${post.category}</a></li>
        `;

        // Render content sections
        const contentContainer = document.querySelector('.article-content');
        let contentHTML = `
            <h2 class="title mb-20">${post.title}</h2>
        `;
        
        post.content.sections.forEach(section => {
            switch(section.type) {
                case 'paragraph':
                    contentHTML += `<p class="desc mb-35">${section.content}</p>`;
                    break;
                case 'heading':
                    contentHTML += `<h${section.level} class="title mb-20">${section.content}</h${section.level}>`;
                    break;
                case 'list':
                    contentHTML += '<ul class="listing-style2 modify ml-20 mb-28">';
                    section.items.forEach(item => {
                        contentHTML += `<li>${item}</li>`;
                    });
                    contentHTML += '</ul>';
                    break;
                case 'cta':
                    contentHTML += `<div class="cta-button text-center mt-50">
                        <a href="${section.link}" class="readon" target="_blank">${section.content}</a>
                    </div>`;
                    break;
            }
        });
        
        contentContainer.innerHTML = contentHTML;
        console.log('Blog post loaded successfully');
    } catch (error) {
        console.error('Error loading blog post:', error);
    }
}

// Load recent posts for sidebar
async function loadRecentPosts() {
    try {
        const response = await fetch('blog-posts.json');
        const data = await response.json();
        
        // Get 5 most recent posts
        const recentPosts = data.posts
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5);
        
        const sidebar = document.querySelector('.sidebar-popular-post');
        let postsHTML = '<div class="sidebar-title"><h3 class="title semi-bold mb-20">Recent Posts</h3></div>';
        
        recentPosts.forEach(post => {
            postsHTML += `
                <div class="single-post mb-20">
                    <div class="post-image">
                        <a href="${post.id}.html"><img src="${post.thumbnail}" alt="${post.title}"></a>
                    </div>
                    <div class="post-desc">
                        <div class="post-title">
                            <h5 class="margin-0"><a href="${post.id}.html">${post.title}</a></h5>
                        </div>
                        <ul>
                            <li><i class="fa fa-calendar"></i> ${formatDate(post.date)}</li>
                        </ul>
                    </div>
                </div>
            `;
        });
        
        sidebar.innerHTML = postsHTML;
    } catch (error) {
        console.error('Error loading recent posts:', error);
    }
}

// Load list of blog posts
async function loadBlogList() {
    try {
        console.log('Loading blog list...');
        const response = await fetch('blog-posts.json');
        const data = await response.json();
        
        const blogList = document.querySelector('.blog-list');
        if (!blogList) {
            console.error('Blog list container not found');
            return;
        }
        
        console.log('Found blog list container, loading posts...');
        
        // Sort posts by date (most recent first)
        const sortedPosts = data.posts.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        let postsHTML = '';
        
        sortedPosts.forEach((post, index) => {
            const isLast = index === sortedPosts.length - 1;
            postsHTML += `
                <div class="blog-wrap shadow ${isLast ? '' : 'mb-70 xs-mb-50'}">
                    <div class="image-part">
                        <a href="${post.id}.html"><img src="${post.image}" alt="${post.title}"></a>
                    </div>
                    <div class="content-part">
                        <h3 class="title mb-10"><a href="${post.id}.html">${post.title}</a></h3>
                        <ul class="blog-meta mb-22">
                            <li><i class="fa fa-calendar-check-o"></i> ${formatDate(post.date)}</li>
                            <li><i class="fa fa-user-o"></i> ${post.author}</li>
                            <li><i class="fa fa-book"></i> <a href="#">${post.category}</a></li>
                        </ul>
                        <p class="desc mb-20">${post.excerpt}</p>
                        <div class="btn-part">
                            <a class="readon-arrow" href="${post.id}.html">Continue Reading</a>
                        </div>
                    </div>
                </div>
            `;
        });
        
        blogList.innerHTML = postsHTML;
        console.log('Blog list loaded successfully');
    } catch (error) {
        console.error('Error loading blog list:', error);
    }
}

// Load latest 3 blog posts for homepage
async function loadLatestPosts() {
    try {
        const response = await fetch('blog-posts.json');
        const data = await response.json();
        
        // Get 3 most recent posts
        const latestPosts = data.posts
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 3);
        
        const blogCarousel = document.querySelector('.rs-carousel');
        if (!blogCarousel) {
            console.error('Blog carousel container not found');
            return;
        }
        
        let postsHTML = '';
        
        latestPosts.forEach(post => {
            postsHTML += `
                <div class="blog-wrap">
                    <div class="img-part">
                        <a href="${post.id}.html"><img src="${post.image}" alt="${post.title}"></a>
                    </div>
                    <div class="content-part">
                        <a class="categories" href="${post.id}.html">${post.category}</a>
                        <h3 class="title"><a href="${post.id}.html">${post.title}</a></h3>
                        <p class="desc">${post.excerpt}</p>
                        <div class="blog-meta">
                            <div class="user-data">
                                <img src="assets/images/blog/avatar/photo15.png" alt="" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover; object-position: center;">
                                <span>${post.author}</span>
                            </div>
                            <div class="date">
                                <i class="fa fa-clock-o"></i> ${formatDate(post.date)}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
        
        blogCarousel.innerHTML = postsHTML;
    } catch (error) {
        console.error('Error loading latest posts:', error);
    }
}

// Initialize based on current page
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded');
    const path = window.location.pathname;
    console.log('Current path:', path);
    
    // Check if we're on the blog list page
    if (path.endsWith('blog.html') || path.endsWith('/blog')) {
        console.log('Detected blog list page');
        loadBlogList();
    } else if (path.endsWith('index.html') || path.endsWith('/')) {
        console.log('Detected homepage');
        loadLatestPosts();
    }
    else if (path.includes('blog-single.html') || path.match(/^\/[^\/]+\.html$/)) {
        console.log('Detected single blog post page');
        loadBlogPost();
    }
    
    // Always load recent posts for sidebar
    loadRecentPosts();
}); 