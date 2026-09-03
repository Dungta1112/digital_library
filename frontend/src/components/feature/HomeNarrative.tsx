'use client';

import React, { useRef } from 'react';
import { useScrollTrigger } from '@/hooks/useScrollTrigger';

export function HomeNarrative() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { gsap, ScrollTrigger, useIsomorphicLayoutEffect } = useScrollTrigger();

    useIsomorphicLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const sections = gsap.utils.toArray<Element>('.narrative-section');
            sections.forEach((section) => {
                gsap.fromTo(section,
                    { opacity: 0, y: 50 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 1,
                        scrollTrigger: {
                            trigger: section,
                            start: "top 85%",
                            end: "bottom 15%",
                            toggleActions: "play reverse play reverse"
                        }
                    }
                );
            });
        }, containerRef);

        return () => ctx.revert();
    }, [gsap, ScrollTrigger]);

    return (
        <div ref={containerRef} className="space-y-48 py-32">
            <div className="narrative-section max-w-lg p-6 bg-white/80 backdrop-blur rounded-xl shadow-sm border">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-6 text-2xl">📚</div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Khám phá tương lai của việc học</h2>
                <p className="text-lg text-gray-600 leading-relaxed">Truy cập hàng nghìn tài liệu học thuật trên một nền tảng số thống nhất, được thiết kế cho giáo dục hiện đại. Đọc, đánh dấu và lưu tài liệu một cách an toàn.</p>
            </div>

            <div className="narrative-section max-w-lg p-6 bg-white/80 backdrop-blur rounded-xl shadow-sm border">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-6 text-2xl">🤖</div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Trợ lý AI thông minh</h2>
                <p className="text-lg text-gray-600 leading-relaxed">Đặt những câu hỏi phức tạp và nhận câu trả lời được nghiên cứu kỹ lưỡng. AI của chúng tôi cung cấp trích dẫn chính xác, liên kết trực tiếp đến tài liệu gốc trong thư viện.</p>
            </div>

            <div className="narrative-section max-w-lg p-6 bg-white/80 backdrop-blur rounded-xl shadow-sm border">
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-6 text-2xl">💬</div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Diễn đàn học thuật cộng tác</h2>
                <p className="text-lg text-gray-600 leading-relaxed">Tham gia các cuộc thảo luận học thuật ý nghĩa. Tham gia nhóm học tập, chia sẻ kiến thức dễ dàng với bạn bè và mở rộng mạng lưới của bạn.</p>
            </div>
        </div>
    );
}