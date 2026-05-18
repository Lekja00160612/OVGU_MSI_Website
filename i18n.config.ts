export default defineI18nConfig(() => ({
  legacy: false,
  locale: 'en',
  messages: {
    en: {
      nav: {
        home: 'Home',
        potential_candidates: 'Potential Candidates',
        program_structure: 'Program Structure',
        academic_activities: 'Academic Activities',
        partners_lecturers: 'Partners & Lecturers',
        tuition_scholarships: 'Tuition & Scholarships',
        laboratories_research: 'Laboratories & Research',
        student_life: 'Student Life'
      },
      footer: {
        subtitle: 'A joint program between Vietnamese-German University (VGU) and Otto von Guericke University Magdeburg (OVGU).',
        quick_links: 'Quick Links',
        contact: 'Contact'
      }
    },
    vi: {
      nav: {
        home: 'Trang Chủ',
        potential_candidates: 'Ứng Viên Tiềm Năng',
        program_structure: 'Chương Trình Học',
        academic_activities: 'Trải Nghiệm Học Thuật',
        partners_lecturers: 'Đối Tác & Giảng Viên',
        tuition_scholarships: 'Học Phí & Học Bổng',
        laboratories_research: 'Thiết Bị & Nghiên Cứu',
        student_life: 'Đời Sống Sinh Viên'
      },
      footer: {
        subtitle: 'Chương trình liên kết giữa Đại học Việt Đức (VGU) và Đại học Otto von Guericke Magdeburg (OVGU).',
        quick_links: 'Liên Kết Nhanh',
        contact: 'Liên Hệ'
      }
    }
  }
}))
