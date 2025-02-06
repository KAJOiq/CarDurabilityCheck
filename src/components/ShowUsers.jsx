import React, { useEffect, useState } from "react";
import { UserPlusIcon } from "@heroicons/react/24/outline";
import fetchData from "../utils/fetchData";
import AddUsers from "./AddUsers";
import DeleteUsers from "./DeleteUsers";

const ShowUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddUser, setShowAddUser] = useState(false);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await fetchData("Users/find-system-users?page=0&pageSize=20");
        if (response.isSuccess) {
          setUsers(response.results?.result || []);
        } else {
          setError("فشل في تحميل المستخدمين");
        }
      } catch (err) {
        setError("انتهت الجلسة! من فضلك قم بإعادة تسجيل الدخول");
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const handleAddUser = (newUser) => {
    setUsers((prevUsers) => [...prevUsers, newUser]); // Update the users state with the new user
    setShowAddUser(false); // Close the add user modal
  };

  const handleDisableUser = (userId) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) => (user.id === userId ? { ...user, disabled: true } : user))
    );
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">قائمة المستخدمين</h2>
        <button
          className="group bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 rounded-xl 
                     hover:from-green-600 hover:to-green-700 transition-all duration-300
                     flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
          onClick={() => setShowAddUser(true)}
        >
          <UserPlusIcon className="w-6 h-6 transition-transform group-hover:scale-110" />
          <span className="font-semibold">إضافة مستخدم جديد</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center p-8 text-gray-500 bg-gray-50 rounded-lg">جارٍ التحميل...</div>
      ) : error ? (
        <div className="text-center p-8 text-red-500 bg-gray-50 rounded-lg">{error}</div>
      ) : users.length === 0 ? (
        <div className="text-center p-8 text-gray-500 bg-gray-50 rounded-lg">لا يوجد مستخدمين مسجلين حالياً</div>
      ) : (
        <div className="border rounded-lg overflow-hidden shadow-sm">
          <table className="w-full border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-right text-blue-600 font-semibold">إجراء</th>
                <th className="px-4 py-3 text-right text-blue-600 font-semibold">هل المستخدم مفعل؟</th>
                <th className="px-4 py-3 text-right text-blue-600 font-semibold">الموقع</th>
                <th className="px-4 py-3 text-right text-blue-600 font-semibold">الصلاحية</th>
                <th className="px-4 py-3 text-right text-blue-600 font-semibold">اسم المستخدم</th>
                <th className="px-4 py-3 text-right text-blue-600 font-semibold">الاسم</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-blue-200">
              {users.map((user, index) => (
                <tr key={index} className={`hover:bg-blue-50 transition-colors ${user.disabled ? 'opacity-70' : ''}`}>
                  <td className="px-4 py-3 text-right">
                    <DeleteUsers userId={user.id} onDisable={handleDisableUser} isDisabled={user.disabled} />
                  </td>
                  <td className="px-4 py-3 text-right text-gray-700">{user.disabled ? "لا" : "نعم"}</td>
                  <td className="px-4 py-3 text-right text-gray-700">{user.location}</td>
                  <td className="px-4 py-3 text-right text-gray-700">{user.userType}</td>
                  <td className="px-4 py-3 text-right text-gray-700">{user.username}</td>
                  <td className="px-4 py-3 text-right text-gray-700">{user.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showAddUser && <AddUsers setShowAddUser={setShowAddUser} setUsers={handleAddUser} />}
    </div>
  );
};

export default ShowUsers;
