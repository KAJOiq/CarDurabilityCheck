import React, { useEffect, useState } from "react";
import { UserPlusIcon, XMarkIcon } from "@heroicons/react/24/outline";

const FetchUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddUser, setShowAddUser] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    username: "",
    code: "",
    role: "user",
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("https://api.example.com/users");
        if (!response.ok) {
          throw new Error(`خطأ: ${response.status} - ${response.statusText}`);
        }
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError("فشل في تحميل بيانات المستخدمين. يرجى المحاولة لاحقًا");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch("https://api.example.com/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });
      if (!response.ok) throw new Error("فشل في إضافة المستخدم");
      const createdUser = await response.json();
      setUsers([...users, createdUser]);
      setShowAddUser(false);
      setNewUser({ name: "", username: "", code: "", role: "user" });
    } catch (error) {
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">قائمة المستخدمين</h2>
        <button
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          onClick={() => setShowAddUser(true)}
        >
          <UserPlusIcon className="w-5 h-5" />
          إضافة مستخدم جديد
        </button>
      </div>

      {users.length === 0 ? (
        <div className="text-center p-8 text-gray-500 bg-gray-50 rounded-lg">
          لا يوجد مستخدمين مسجلين حالياً
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden shadow-sm">
          <table className="w-full border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-right text-gray-600 font-semibold">الاسم</th>
                <th className="px-4 py-3 text-right text-gray-600 font-semibold">اسم المستخدم</th>
                <th className="px-4 py-3 text-right text-gray-600 font-semibold">الصلاحية</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-gray-700">{user.name}</td>
                  <td className="px-4 py-3 text-gray-700">{user.username}</td>
                  <td className="px-4 py-3 text-gray-700">{user.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showAddUser && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-lg flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">إضافة مستخدم جديد</h3>
              <button onClick={() => setShowAddUser(false)} className="text-gray-500 hover:text-gray-800">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="الاسم"
                value={newUser.name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg"
                required
              />
              <input
                type="text"
                name="username"
                placeholder="اسم المستخدم"
                value={newUser.username}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg"
                required
              />
              <input
                type="text"
                name="code"
                placeholder="الرمز"
                value={newUser.code}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg"
                required
              />
              <select
                name="role"
                value={newUser.role}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg bg-white"
                required
              >
                <option value="user">مستخدم</option>
                <option value="admin">مدير</option>
              </select>
              <button type="submit" disabled={isSubmitting} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg w-full">
                {isSubmitting ? "جاري الإضافة..." : "إضافة"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FetchUsers;
