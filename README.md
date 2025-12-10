<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

# eRMS - Electronic Records Management System

<p align="center">
A comprehensive web-based Records Management System built with modern web technologies to streamline document management, tracking, and retrieval processes.
</p>

## About eRMS

The Electronic Records Management System (eRMS) is a robust application designed to help organizations efficiently manage, organize, and retrieve digital records. It provides intuitive interfaces for document handling, user access control, and comprehensive audit trails.

### Key Features

-   **Document Management**: Upload, organize, and categorize records
-   **User Access Control**: Role-based permissions and authentication
-   **Search & Retrieval**: Fast and efficient document search capabilities
-   **Audit Trails**: Complete tracking of all system activities
-   **Secure Storage**: Encrypted data storage and transmission
-   **Responsive Design**: Works seamlessly on desktop and mobile devices

## Setup Instructions

### Prerequisites

-   PHP 8.0 or higher
-   Composer
-   Node.js and npm
-   MySQL or compatible database
-   Git

### Installation Steps

1. **Clone the repository**

    ```bash
    git clone <repository-url>
    cd eRMS-app
    ```

2. **Install PHP dependencies**

    ```bash
    composer install
    ```

3. **Install Node dependencies**

    ```bash
    npm install
    ```

4. **Create environment file**

    ```bash
    cp .env.example .env
    ```

5. **Generate application key**

    ```bash
    php artisan key:generate
    ```

6. **Configure database**

    - Edit `.env` file and add your database credentials
    - Run migrations:

    ```bash
    php artisan migrate
    ```

7. **Build frontend assets**

    ```bash
    npm run build
    ```

8. **Start the development server**

    ```bash
    php artisan serve
    ```

9. **Access the application**
    - Open your browser and navigate to `http://localhost:8000`

## Technologies & Acknowledgments

We would like to extend our thanks to the following technologies and frameworks that power eRMS:

-   **[Laravel](https://laravel.com)** - The elegant PHP web framework for backend development
-   **[Vue.js](https://vuejs.org)** - Progressive JavaScript framework for interactive user interfaces
-   **[Tailwind CSS](https://tailwindcss.com)** - Utility-first CSS framework for responsive design
-   **[MySQL](https://www.mysql.com)** - Reliable relational database management system
-   **[Composer](https://getcomposer.org)** - PHP package manager
-   **[npm](https://www.npmjs.com)** - Node package manager for JavaScript dependencies
-   **[Git](https://git-scm.com)** - Version control system

## Contributing

Thank you for considering contributing to eRMS! Please review our contribution guidelines before submitting pull requests.

## Security

If you discover a security vulnerability, please email security@erms-app.local. All security vulnerabilities will be promptly addressed.

## License

The eRMS application is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
