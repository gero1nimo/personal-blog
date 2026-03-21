# System Role
Act as an expert frontend developer. Your task is to design and write the code (using HTML, JavaScript, and Tailwind CSS) for a secure, functional, and modern Admin Dashboard Panel. This panel will be used to manage a personal portfolio and blog.

## Context & API Integration
* The frontend will communicate with a FastAPI backend via RESTful endpoints (`/api/v1/...`).
* The system uses stateless JWT Authentication. The frontend must handle a Bearer token in the `Authorization` header for all requests.
* **CRITICAL REQUIREMENT:** All static UI text, labels, placeholders, and buttons visible to the user MUST be in Turkish.

## Design System & Vibe
* **Aesthetic:** Clean, professional, and data-focused (SaaS dashboard style).
* **Color Palette:** Neutral light grey background for the main canvas, crisp white for content cards, dark slate/black for the sidebar, and a primary accent color (e.g., a subtle indigo or blue) for primary buttons and active states.
* **Typography:** Modern sans-serif (e.g., Inter or Roboto). Clear visual hierarchy between page titles, table headers, and form labels.

## Section-by-Section Structure

### 1. Authentication (Login Page)
* **Layout:** Centered login card on a light background.
* **Content:** * "Yönetici Girişi" (Admin Login) title.
    * Email and Password input fields.
    * A "Giriş Yap" (Login) submit button.
    * Note: This page should mock saving a JWT token to `localStorage` upon successful login.

### 2. Global Layout (Sidebar & Topbar)
* **Sidebar (Left, Fixed):**
    * Logo or Admin Profile Name at the top.
    * Navigation links with icons: "Kontrol Paneli" (Dashboard), "Profil Ayarları" (Profile Settings), "Blog Yönetimi" (Blog Management), "Proje Yönetimi" (Project Management).
    * A "Çıkış Yap" (Logout) button at the bottom.
* **Topbar (Top, Fixed):**
    * Page title dynamically updating based on the current route.
    * A user avatar/profile dropdown on the right.

### 3. Dashboard (Home)
* **Layout:** Grid system displaying high-level metrics.
* **Content:** * 3 summary cards: "Toplam Yazı" (Total Posts), "Toplam Proje" (Total Projects), and "Toplam Görüntülenme" (Total Views).
    * A "Son Eklenenler" (Recently Added) table showing the latest 3 blog posts or projects.

### 4. Profile Settings (Profil Ayarları)
* **Layout:** A clean form inside a white card.
* **Fields:**
    * Full Name, Professional Title (e.g., Backend Developer).
    * "Hakkımda" (About Me) textarea.
    * "Kullanılan Teknolojiler" (Tech Stack) comma-separated input.
    * Social Media Links (GitHub, LinkedIn, Email).
* **Action:** "Değişiklikleri Kaydet" (Save Changes) button at the bottom right.

### 5. Blog Management (Blog Yönetimi)
* **Layout:** Split view or two separate pages (List View and Create/Edit View).
* **List View:**
    * A data table with columns: "Başlık" (Title), "Durum" (Status - Yayında/Taslak), "Görüntülenme" (Views), "Tarih" (Date), and "İşlemler" (Actions - Edit/Delete buttons).
    * A prominent "Yeni Yazı Ekle" (Add New Post) button at the top right.
* **Create/Edit View (Form):**
    * "Yazı Başlığı" (Title) input.
    * "URL Uzantısı" (Slug) input (auto-generated from title but editable).
    * "İçerik" (Content) - Mock a Markdown or Rich Text Editor area.
    * "Etiketler" (Tags) input.
    * "Yayına Al" (Publish) toggle switch.
    * "Kaydet" (Save) button.

### 6. Project Management (Proje Yönetimi)
* **Layout:** Similar to Blog Management (List + Form).
* **Create/Edit View (Form) Fields:**
    * "Proje Adı" (Project Name).
    * "Açıklama" (Description) textarea.
    * "Kullanılan Teknolojiler" (Tech Stack) input.
    * "Repo URL" (GitHub Link) and "Canlı URL" (Live Demo Link).
    * "Görsel URL" (Image URL) input.

## Technical Constraints
* Write semantic HTML5 and build the layout structure clearly.
* Use Tailwind CSS utility classes for all styling.
* Provide the HTML structure using a Single Page Application (SPA) illusion via JavaScript, or structure the code in reusable components if you assume a framework like React or Vue. 
* Ensure the dashboard is responsive (the sidebar should become a hamburger menu on mobile devices).