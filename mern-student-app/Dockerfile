# Câu 51. Khai báo Node.js Image làm Base Image cho quá trình Build React Application
FROM node:18-alpine

# Câu 52. Thiết lập thư mục làm việc bên trong Frontend Container
WORKDIR /app

# Câu 53. Sao chép package.json và package-lock.json vào Container
COPY package*.json ./

# Câu 54. Cài đặt các package của React Application
RUN npm install

# Câu 55. Sao chép source code React vào Container
COPY . .

# Câu 56. Build React Application trong quá trình xây dựng Docker Image
RUN npm run build

# Cài đặt serve để phục vụ các file tĩnh trong thư mục build/dist
RUN npm install -g serve

EXPOSE 3000

# Khởi chạy ứng dụng web tĩnh
CMD ["serve", "-s", "dist", "-l", "3000"]