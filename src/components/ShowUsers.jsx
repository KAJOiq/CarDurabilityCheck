import React, { useEffect, useState } from "react";
import { UserPlusIcon, PencilIcon } from "@heroicons/react/24/outline";
import fetchData from "../utils/fetchData";
import AddUsers from "./AddUsers";
import DeleteUsers from "./DeleteUsers";
import UpdateUsers from "./UpdateUsers";

const ShowUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showUpdateUser, setShowUpdateUser] = useState(false);
  const [userIdToUpdate, setUserIdToUpdate] = useState(null);

  const [filters, setFilters] = useState({
    name: "",
    username: "",
    status: "",
    userType: "",
    page: 0,
    pageSize: 20,
  });

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const { name, username, status, userType, page, pageSize } = filters;
        const queryParams = new URLSearchParams({
          name,
          username,
          status,
          userType,
          page: page.toString(),
          pageSize: pageSize.toString(),
        }).toString();

        const response = await fetchData(`Users/find-system-users?${queryParams}`);
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
  }, [filters]); // Re-fetch users when filters change

  const handleAddUser = (newUser) => {
    setUsers((prevUsers) => [...prevUsers, newUser]); // Update the users state with the new user
    setShowAddUser(false); // Close the add user modal
  };

  const handleDisableUser = (userId) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) => (user.id === userId ? { ...user, disabled: true } : user))
    );
  };

  const handleEditUser = (userId) => {
    setUserIdToUpdate(userId);
    setShowUpdateUser(true);
  };

  const refreshUsers = async () => {
    // Refresh the users list after updating
    try {
      const { name, username, status, userType, page, pageSize } = filters;
      const queryParams = new URLSearchParams({
        name,
        username,
        status,
        userType,
        page: page.toString(),
        pageSize: pageSize.toString(),
      }).toString();

      const response = await fetchData(`Users/find-system-users?${queryParams}`);
      if (response.isSuccess) {
        setUsers(response.results?.result || []);
      }
    } catch (err) {
      setError("Error while refreshing users");
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
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

      <div className="mb-6 p-4 bg-white shadow-lg rounded-lg text-right">
        <h3 className="text-lg font-semibold text-gray-700 mb-4"></h3>
        <div className="flex flex-wrap gap-4">
          <input
            type="text"
            name="name"
            value={filters.name}
            onChange={handleFilterChange}
            placeholder="الاسم"
            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all text-right"
          />
          <input
            type="text"
            name="username"
            value={filters.username}
            onChange={handleFilterChange}
            placeholder="اسم المستخدم"
            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all text-right"
          />
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all text-right"
          >
            <option value="">الكل</option>
            <option value="true">غير مفعل</option>
            <option value="false">مفعل</option>
          </select>
          <select
            name="userType"
            value={filters.userType}
            onChange={handleFilterChange}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all text-right"
          >
            <option value="">الكل</option>
            <option value="admin">admin</option>
            <option value="user">user</option>
            <option value="reporter">reporter</option>
            <option value="checker">checker</option>
            <option value="supervisor">supervisor</option>
          </select>
        </div>
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
                <th className="px-4 py-3 text-right text-blue-600 font-semibold"></th>
                <th className="px-4 py-3 text-right text-blue-600 font-semibold">هل المستخدم مفعل؟</th>
                <th className="px-4 py-3 text-right text-blue-600 font-semibold">الموقع</th>
                <th className="px-4 py-3 text-right text-blue-600 font-semibold">الصلاحية</th>
                <th className="px-4 py-3 text-right text-blue-600 font-semibold">اسم المستخدم</th>
                <th className="px-4 py-3 text-right text-blue-600 font-semibold">الاسم</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-blue-200">
              {users.map((user, index) => (
                <tr key={index} className={`hover:bg-blue-50 transition-colors ${user.disabled ? 'opacity-80' : ''}`}>
                  <td className="px-4 py-3 text-right">
                    <DeleteUsers userId={user.id} onDisable={handleDisableUser} isDisabled={user.disabled} />
                    <button
                      className={`ml-2 ${user.disabled ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600'}`}
                      onClick={() => !user.disabled && handleEditUser(user.id)}
                      disabled={user.disabled}
                    >
                      <PencilIcon className={`w-6 h-5 ${user.disabled ? 'text-gray-400' : 'text-blue-600'}`} />
                    </button>
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
      {showUpdateUser && <UpdateUsers userId={userIdToUpdate} closeModal={() => setShowUpdateUser(false)} refreshUsers={refreshUsers} />}
    </div>
  );
};

export default ShowUsers;
