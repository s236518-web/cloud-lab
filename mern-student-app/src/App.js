import { useEffect, useState } from 'react';

const initialForm = { studentId: '', name: '', email: '' };

function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Khai báo Base URL tới Backend Render
  const apiUrl = import.meta.env.VITE_API_URL || "https://mern-backend-236518.onrender.com";

  // 1. Hàm lấy danh sách sinh viên
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${apiUrl}/api/students`);
      const data = await res.json();

      if (Array.isArray(data)) {
        setStudents(data);
      } else if (Array.isArray(data.data)) {
        setStudents(data.data);
      } else {
        setStudents([]);
      }
    } catch (err) {
      console.error("Lỗi fetch:", err);
      setError("Không thể tải danh sách sinh viên");
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
    setError('');
  };

  // 2. Hàm Thêm / Sửa sinh viên (ĐÃ SỬA ĐÚNG URL /api/students)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.studentId || !form.name || !form.email) {
      setError('Vui lòng nhập đầy đủ mã sinh viên, tên và email.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      // Đã bổ sung chính xác endpoint /api/students
      const url = editingId ? `${apiUrl}/api/students/${editingId}` : `${apiUrl}/api/students`;
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result?.message || 'Thao tác thất bại');
      }

      resetForm();
      await fetchStudents();
    } catch (err) {
      console.error('Lỗi thao tác sinh viên:', err);
      setError(err.message || 'Có lỗi xảy ra khi lưu dữ liệu.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (student) => {
    setEditingId(student._id);
    setForm({
      studentId: student.studentId,
      name: student.name,
      email: student.email,
    });
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 3. Hàm Xóa sinh viên (ĐÃ SỬA ĐÚNG URL /api/students)
  const handleDelete = async (id) => {
    const confirmed = window.confirm('Bạn chắc chắn muốn xóa sinh viên này?');
    if (!confirmed) return;

    try {
      const res = await fetch(`${apiUrl}/api/students/${id}`, { method: 'DELETE' });
      const result = await res.json();

      if (!res.ok) {
        throw new Error(result?.message || 'Xóa thất bại');
      }

      if (editingId === id) resetForm();
      await fetchStudents();
    } catch (err) {
      console.error('Lỗi khi xóa sinh viên:', err);
      setError(err.message || 'Không thể xóa sinh viên.');
    }
  };

  const isEditing = Boolean(editingId);

  return (
    <div style={styles.page}>
      <div style={styles.wrapper}>
        <header style={styles.header}>
          <div>
            <p style={styles.eyebrow}>Quản lý sinh viên</p>
            <h1 style={styles.title}>Quản lý sinh viên</h1>
          </div>
          <span style={styles.badge}>{students.length} sinh viên</span>
        </header>

        <div style={styles.grid}>
          <form onSubmit={handleSubmit} style={styles.formCard}>
            <h2 style={styles.sectionTitle}>{isEditing ? 'Cập nhật sinh viên' : 'Thêm sinh viên mới'}</h2>

            <label style={styles.label}>
              Mã sinh viên
              <input
                name="studentId"
                value={form.studentId}
                onChange={handleChange}
                placeholder="VD: SV001"
                style={styles.input}
              />
            </label>

            <label style={styles.label}>
              Họ và tên
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="VD: Nguyễn Văn A"
                style={styles.input}
              />
            </label>

            <label style={styles.label}>
              Email
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="VD: a@gmail.com"
                style={styles.input}
              />
            </label>

            {error && <div style={styles.errorBox}>{error}</div>}

            <div style={styles.buttonRow}>
              <button type="submit" disabled={submitting} style={styles.primaryButton}>
                {submitting ? (isEditing ? 'Đang lưu...' : 'Đang thêm...') : isEditing ? 'Lưu thay đổi' : 'Thêm sinh viên'}
              </button>

              {isEditing && (
                <button type="button" onClick={resetForm} style={styles.secondaryButton}>
                  Hủy
                </button>
              )}
            </div>
          </form>

          <div style={styles.listCard}>
            <h2 style={styles.sectionTitle}>Danh sách sinh viên</h2>

            {loading ? (
              <p style={styles.loadingText}>Đang tải dữ liệu...</p>
            ) : students.length === 0 ? (
              <div style={styles.emptyState}>Chưa có sinh viên nào trong danh sách.</div>
            ) : (
              <div style={styles.list}>
                {students.map((student) => (
                  <div key={student._id} style={styles.studentCard}>
                    <div style={styles.avatar}>{student.name ? student.name.charAt(0).toUpperCase() : 'S'}</div>

                    <div style={styles.studentInfo}>
                      <strong style={styles.studentName}>{student.name}</strong>
                      <div style={styles.metaRow}>{student.studentId}</div>
                      <div style={styles.metaRow}>{student.email}</div>
                    </div>

                    <div style={styles.actionGroup}>
                      <button type="button" onClick={() => handleEdit(student)} style={styles.editButton}>
                        Sửa
                      </button>
                      <button type="button" onClick={() => handleDelete(student._id)} style={styles.deleteButton}>
                        Xóa
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #eef4ff 0%, #f6f7fb 100%)',
    padding: '40px 20px',
    fontFamily: 'Segoe UI, Tahoma, sans-serif',
    color: '#1f2937',
  },
  wrapper: {
    maxWidth: 1100,
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    gap: 16,
    flexWrap: 'wrap',
  },
  eyebrow: {
    margin: 0,
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
    fontSize: 12,
    color: '#4f46e5',
    fontWeight: 700,
  },
  title: {
    margin: '8px 0 0',
    fontSize: 'clamp(2rem, 4vw, 3rem)',
    fontWeight: 800,
  },
  badge: {
    background: '#e0e7ff',
    color: '#3730a3',
    padding: '10px 16px',
    borderRadius: 999,
    fontWeight: 700,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'minmax(300px, 400px) minmax(0, 1fr)',
    gap: 24,
  },
  formCard: {
    background: '#ffffff',
    borderRadius: 20,
    padding: 24,
    boxShadow: '0 18px 45px rgba(15, 23, 42, 0.08)',
    border: '1px solid #e5e7eb',
  },
  listCard: {
    background: '#ffffff',
    borderRadius: 20,
    padding: 24,
    boxShadow: '0 18px 45px rgba(15, 23, 42, 0.08)',
    border: '1px solid #e5e7eb',
  },
  sectionTitle: {
    margin: '0 0 18px',
    fontSize: '1.5rem',
  },
  label: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    marginBottom: 16,
    fontWeight: 600,
    color: '#374151',
  },
  input: {
    width: '100%',
    padding: '12px 14px',
    borderRadius: 12,
    border: '1px solid #d1d5db',
    outline: 'none',
    fontSize: 15,
    boxSizing: 'border-box',
    transition: 'border-color 0.2s ease',
  },
  errorBox: {
    background: '#fef2f2',
    border: '1px solid #fecaca',
    color: '#b91c1c',
    padding: '10px 12px',
    borderRadius: 12,
    marginBottom: 16,
    fontSize: 14,
  },
  buttonRow: {
    display: 'flex',
    gap: 12,
    flexWrap: 'wrap',
  },
  primaryButton: {
    flex: 1,
    minWidth: 160,
    background: 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: 12,
    padding: '12px 16px',
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0 12px 20px rgba(79, 70, 229, 0.22)',
  },
  secondaryButton: {
    background: '#e5e7eb',
    color: '#111827',
    border: 'none',
    borderRadius: 12,
    padding: '12px 16px',
    fontWeight: 700,
    cursor: 'pointer',
  },
  loadingText: {
    margin: 0,
    color: '#6b7280',
  },
  emptyState: {
    background: '#f8fafc',
    border: '1px dashed #cbd5e1',
    color: '#475569',
    borderRadius: 14,
    padding: 20,
    textAlign: 'center',
  },
  list: {
    display: 'grid',
    gap: 14,
  },
  studentCard: {
    display: 'grid',
    gridTemplateColumns: '44px minmax(0, 1fr) auto',
    gap: 14,
    alignItems: 'center',
    background: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: 16,
    padding: 14,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #c7d2fe 0%, #a5b4fc 100%)',
    color: '#1e1b4b',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 800,
  },
  studentInfo: {
    minWidth: 0,
  },
  studentName: {
    fontSize: 18,
    display: 'block',
    marginBottom: 4,
  },
  metaRow: {
    color: '#475569',
    fontSize: 14,
    wordBreak: 'break-word',
  },
  actionGroup: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  },
  editButton: {
    background: '#dbeafe',
    color: '#1d4ed8',
    border: 'none',
    borderRadius: 10,
    padding: '8px 12px',
    fontWeight: 700,
    cursor: 'pointer',
  },
  deleteButton: {
    background: '#fee2e2',
    color: '#b91c1c',
    border: 'none',
    borderRadius: 10,
    padding: '8px 12px',
    fontWeight: 700,
    cursor: 'pointer',
  },
};

export default App;