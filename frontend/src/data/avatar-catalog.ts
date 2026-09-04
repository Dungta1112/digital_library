import { AvatarPreset } from '@/types/profile';

export const AVATAR_PRESETS: AvatarPreset[] = [
  // 1. Nhóm Emerald: Nghiên cứu & Sách
  {
    id: 'academic-book',
    name: 'Sách học thuật',
    theme: 'emerald',
    themeLabel: 'Nghiên cứu & Học thuật',
    url: '/avatars/academic-book.svg',
    alt: 'Ảnh đại diện sách học thuật mở màu xanh emerald',
    accentColor: '#059669',
  },
  {
    id: 'scholar-glasses',
    name: 'Học giả trí thức',
    theme: 'emerald',
    themeLabel: 'Nghiên cứu & Học thuật',
    url: '/avatars/scholar-glasses.svg',
    alt: 'Ảnh đại diện kính học giả nghiên cứu',
    accentColor: '#10b981',
  },
  {
    id: 'quill-pen',
    name: 'Bút lông biên khảo',
    theme: 'emerald',
    themeLabel: 'Nghiên cứu & Học thuật',
    url: '/avatars/quill-pen.svg',
    alt: 'Ảnh đại diện bút lông học thuật',
    accentColor: '#34d399',
  },
  {
    id: 'microscope',
    name: 'Kính hiển vi',
    theme: 'emerald',
    themeLabel: 'Nghiên cứu & Học thuật',
    url: '/avatars/microscope.svg',
    alt: 'Ảnh đại diện kính hiển vi khám phá',
    accentColor: '#047857',
  },

  // 2. Nhóm Navy: Công nghệ & Dữ liệu
  {
    id: 'data-scientist',
    name: 'Khoa học dữ liệu',
    theme: 'navy',
    themeLabel: 'Công nghệ & Dữ liệu',
    url: '/avatars/data-scientist.svg',
    alt: 'Ảnh đại diện biểu đồ khoa học dữ liệu',
    accentColor: '#2563eb',
  },
  {
    id: 'tech-laptop',
    name: 'Công nghệ & Lập trình',
    theme: 'navy',
    themeLabel: 'Công nghệ & Dữ liệu',
    url: '/avatars/tech-laptop.svg',
    alt: 'Ảnh đại diện máy tính xách tay lập trình',
    accentColor: '#3b82f6',
  },
  {
    id: 'lab-flask',
    name: 'Phòng thí nghiệm',
    theme: 'navy',
    themeLabel: 'Công nghệ & Dữ liệu',
    url: '/avatars/lab-flask.svg',
    alt: 'Ảnh đại diện bình thí nghiệm khoa học',
    accentColor: '#0284c7',
  },
  {
    id: 'algorithm-cube',
    name: 'Khối thuật toán',
    theme: 'navy',
    themeLabel: 'Công nghệ & Dữ liệu',
    url: '/avatars/algorithm-cube.svg',
    alt: 'Ảnh đại diện khối lập phương thuật toán',
    accentColor: '#1d4ed8',
  },

  // 3. Nhóm Amber: Giảng dạy & Sáng tạo
  {
    id: 'mentor-podium',
    name: 'Bục giảng truyền cảm hứng',
    theme: 'amber',
    themeLabel: 'Giảng dạy & Sáng tạo',
    url: '/avatars/mentor-podium.svg',
    alt: 'Ảnh đại diện bục giảng người hướng dẫn',
    accentColor: '#d97706',
  },
  {
    id: 'lightbulb-idea',
    name: 'Ý tưởng sáng tạo',
    theme: 'amber',
    themeLabel: 'Giảng dạy & Sáng tạo',
    url: '/avatars/lightbulb-idea.svg',
    alt: 'Ảnh đại diện bóng đèn phát kiến',
    accentColor: '#f59e0b',
  },
  {
    id: 'creative-compass',
    name: 'Compa kiến thiết',
    theme: 'amber',
    themeLabel: 'Giảng dạy & Sáng tạo',
    url: '/avatars/creative-compass.svg',
    alt: 'Ảnh đại diện compa thiết kế sáng tạo',
    accentColor: '#b45309',
  },
  {
    id: 'presentation-chart',
    name: 'Thuyết trình & Báo cáo',
    theme: 'amber',
    themeLabel: 'Giảng dạy & Sáng tạo',
    url: '/avatars/presentation-chart.svg',
    alt: 'Ảnh đại diện bảng thuyết trình học thuật',
    accentColor: '#ea580c',
  },

  // 4. Nhóm Violet: AI & Toán học
  {
    id: 'ai-spark',
    name: 'Trí tuệ Nhân tạo AI',
    theme: 'violet',
    themeLabel: 'AI & Toán học',
    url: '/avatars/ai-spark.svg',
    alt: 'Ảnh đại diện tia sáng trí tuệ nhân tạo',
    accentColor: '#8b5cf6',
  },
  {
    id: 'math-pi',
    name: 'Toán học & Logic',
    theme: 'violet',
    themeLabel: 'AI & Toán học',
    url: '/avatars/math-pi.svg',
    alt: 'Ảnh đại diện ký hiệu toán học Pi',
    accentColor: '#7c3aed',
  },
  {
    id: 'cosmos-orbit',
    name: 'Quỹ đạo không gian',
    theme: 'violet',
    themeLabel: 'AI & Toán học',
    url: '/avatars/cosmos-orbit.svg',
    alt: 'Ảnh đại diện quỹ đạo hành tinh thiên văn',
    accentColor: '#9333ea',
  },
  {
    id: 'neural-network',
    name: 'Mạng nơ-ron học máy',
    theme: 'violet',
    themeLabel: 'AI & Toán học',
    url: '/avatars/neural-network.svg',
    alt: 'Ảnh đại diện mạng nơ-ron kết nối',
    accentColor: '#a855f7',
  },
];

export function getFullAvatarUrl(relativeOrAbsoluteUrl: string): string {
  if (!relativeOrAbsoluteUrl) return '';
  if (relativeOrAbsoluteUrl.startsWith('http://') || relativeOrAbsoluteUrl.startsWith('https://')) {
    return relativeOrAbsoluteUrl;
  }
  if (typeof window !== 'undefined') {
    const origin = window.location.origin;
    const cleanPath = relativeOrAbsoluteUrl.startsWith('/') ? relativeOrAbsoluteUrl : `/${relativeOrAbsoluteUrl}`;
    return `${origin}${cleanPath}`;
  }
  return relativeOrAbsoluteUrl;
}
