'use client';

import { motion } from 'framer-motion';

const features = [
  { title: "Tìm kiếm tài liệu thông minh", desc: "Tìm tài liệu theo tiêu đề, tác giả, môn học, ngành học, từ khóa hoặc chủ đề nghiên cứu." },
  { title: "Lọc và sắp xếp tài liệu", desc: "Lọc tài liệu theo danh mục, loại tài liệu, năm, mức độ liên quan hoặc độ phổ biến." },
  { title: "Đọc và lưu tài liệu", desc: "Người dùng có thể xem chi tiết, đọc online, tải xuống hoặc lưu tài liệu yêu thích." },
  { title: "Hỏi AI theo tài liệu", desc: "Đặt câu hỏi trực tiếp về nội dung tài liệu và nhận phản hồi có căn cứ từ hệ thống AI." },
  { title: "Tóm tắt tài liệu", desc: "Rút gọn nội dung dài thành các ý chính, giúp người học nắm bắt nhanh cấu trúc và thông tin quan trọng." },
  { title: "Hiển thị nguồn trích dẫn", desc: "Hiển thị nguồn rõ ràng để người dùng kiểm chứng khi AI trả về kết quả." },
  { title: "Thảo luận học thuật", desc: "Đăng bài, bình luận, trao đổi câu hỏi và chia sẻ góc nhìn học tập trong diễn đàn." },
  { title: "Nhóm học tập theo chủ đề", desc: "Tạo hoặc tham gia nhóm học tập để cộng tác, chia sẻ tài liệu và trao đổi theo lĩnh vực quan tâm." }
];

export function HomeFeatures() {
  return (
    <section className="relative py-24 bg-white overflow-hidden z-10">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="font-playfair text-4xl md:text-5xl font-bold text-gray-900 mb-6"
          >
            Tính năng nổi bật
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-gray-600 leading-relaxed"
          >
            Mọi chức năng được thiết kế để hỗ trợ học tập, nghiên cứu và trao đổi học thuật trong một trải nghiệm thống nhất.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="group relative p-6 rounded-3xl bg-[rgba(255,255,255,0.72)] backdrop-blur-[20px] border border-[rgba(22,163,74,0.12)] hover:border-transparent hover:shadow-[0_0_25px_rgba(22,163,74,0.15)] transition-all duration-300"
            >
              {/* Hover gradient border illusion */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-green-400 to-red-400 opacity-0 group-hover:opacity-10 pointer-events-none transition-opacity duration-300" />
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center font-bold text-sm mb-4 border border-green-100 group-hover:bg-green-600 group-hover:text-white transition-colors duration-300">
                  {index + 1}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed flex-grow">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
