<a id='readme-top'> </a>

<br />
<div align="center">
  <a href="https://github.com/SDC-Team-Io/reviews">
    <!-- <img src="" alt="finance tracker logo" width="50" height="50" /> -->
  </a>
  <h3 align="center">
    SDC/reviews
  </h3>
  <p align="center">
    <br />
    <a href="https://github.com/SDC-Team-Io/reviews"><strong>Explore the docs »</strong></a>
    <br />
  </p>
</div>

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about">About</a>
      <ul>
        <li>
          <a href="#built-with">Built With</a>
        </li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li>
          <a href="#prerequisites">Prerequisites</a>
        </li>
        <li>
          <a href="#installation">Installation</a>
        </li>
      </ul>
    </li>
    <li>
      <a href="#usage">Usage</a>
    </li>
    <li>
      <a href="#optimizations">Optimizations</a>
    </li>
    <li>
      <a href="#contact">Contact</a>
    </li>
  </ol>
</details>

## About

<br />
<p>
The SDC/reviews project is an advanced backend server and database system, designed for high performance and scalability. Powered by Express and PostgreSQL and hosted on AWS, it efficiently handles extensive product data across a collection of over 15 million products. Leveraging NGINX for superior load balancing and data caching, alongside optimized RDBMS indexed tables, the system achieves peak performance metrics. These include an impressive low latency of 216ms and a throughput of 1000 requests per second (RPS), all while maintaining a 0% error rate. This integration of cutting-edge technologies and strategic optimizations makes SDC/reviews a paragon of backend engineering, perfectly suited for managing and retrieving large-scale product data with exceptional efficiency and reliability.
</p>

### Built With
![NGINX](https://img.shields.io/badge/nginx-%23009639.svg?style=for-the-badge&logo=nginx)
![Express](https://img.shields.io/badge/express-%23000000.svg?style=for-the-badge&logo=express)
![AWS](https://img.shields.io/badge/aws-%23FF9900.svg?style=for-the-badge&logo=amazonaws)
![Loader.io](https://img.shields.io/badge/loader.io-%2326B4FF.svg?style=for-the-badge&logo=loader.io)
![K6](https://img.shields.io/badge/k6-%237D64FF.svg?style=for-the-badge&logo=k6)

<p align="right">
  (<a href="#readme-top">back to top</a>)
</p>

## Getting Started

<p>
    Instructions to setup SDC on your local machine below.
</p>

### Prerequisites

![NPM](https://img.shields.io/badge/NPM-%23000000.svg?style=for-the-badge&logo=npm&logoColor=white)

```sh
npm install npm@latest -g
```

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/SDC-Team-Io/reviews.git
   ```
2. Navigate to the /reviews directory
   ```sh
   cd reviews
   ```
3. Install NPM packages
   ```sh
   npm install
   ```
4. Enter your port, and PSQL credentials `.env` file
   ```sh
    DATABASE_URL=<your db url>
    PORT=<db port>
    DB_NAME=<db name in psql>
    DB_USER=<psql username>
   ```
5. Run Server
   ```sh
   npm run server
   ```

## Usage

SDC/reviews is engineered to operate on a specialized port, seamlessly integrated with an NGINX load balancer. This sophisticated setup ensures the efficient distribution of incoming requests across three high-performance instances. Each instance hosts critical services, all working in harmony under the NGINX framework. This design not only guarantees consistent performance but also enhances reliability and scalability. It adeptly manages diverse demands, ensuring a smooth, efficient, and highly responsive service environment.

Run Test: ```k6 run script.js ```


<p align="right">(<a href="#readme-top">back to top</a>)</p>


## Optimizations

 1. Reduction in Questions and Answers API calls to 1 initial call by presortings answers from API
 2. Reduced number of API calls made from infinite scrolling by throttling API requests to prevent exceeding limits 
 3. Added compression, code splitting and preload from client server to reduce webpack size and improve performance

<!-- CONTACT -->

## Contact

<h3 align='center'> Luke</h3>
<h4 align='center'>
  <a href="https://www.linkedin.com/in/lucas-larson-6a4bb799/">Linkedin</a> |
  <a href="https://github.com/LukeLarson2">GitHub</a>
</h4>

<p align="right">(<a href="#readme-top">back to top</a>)</p>
