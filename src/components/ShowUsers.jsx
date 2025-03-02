import React, { useEffect, useState } from "react";
import { UserPlusIcon, PencilIcon } from "@heroicons/react/24/outline";
import fetchData from "../utils/fetchData";
import AddUsers from "./AddUsers";
import DisableUsers from "./DisableUsers";
import EnableUsers from "./EnableUsers";
import UpdateUsers from "./UpdateUsers";
import UpdateUsersBysuperadmin from "./UpdateUsersBysuperadmin";
const ShowUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showUpdateUser, setShowUpdateUser] = useState(false);
  const [userIdToUpdate, setUserIdToUpdate] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const isSuperAdmin = localStorage.getItem("role") === "superadmin";

  const [filters, setFilters] = useState({
    name: "",
    username: "",
    status: "",
    userType: "",
    page: 0,
    pageSize: 10,
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
          setTotalPages(Math.ceil(response.results?.totalCount / pageSize));
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
  }, [filters]);

  const handleAddUser = (newUser) => {
    setUsers((prevUsers) => [...prevUsers, newUser]); 
    setShowAddUser(false);
  };

  const handleDisableUser = (userId) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) => (user.id === userId ? { ...user, disabled: true } : user))
    );
  };

  const handleEnableUser = (userId) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) => (user.id === userId ? { ...user, disabled: false } : user))
    );
  };

  const handleEditUser = (userId) => {
    setUserIdToUpdate(userId);
    setShowUpdateUser(true);
  };

  const refreshUsers = async () => {
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
        setTotalPages(Math.ceil(response.results?.totalCount / pageSize));
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

  const handlePageChange = (newPage) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      page: newPage,
    }));
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">قائمة المستخدمين</h2>
        {localStorage.getItem("role") === "superadmin" && (
        <button
          className="group bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg 
                     hover:from-green-600 hover:to-green-700 transition-all duration-300
                     flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
          onClick={() => setShowAddUser(true)}
        >
          <UserPlusIcon className="w-5 h-5 transition-transform group-hover:scale-110" />
          <span className="font-semibold text-sm">إضافة مستخدم جديد</span>
        </button>
        )}
      </div>

      <div className="mb-8 bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-600 text-right">الاسم</label>
            <input
              type="text"
              name="name"
              value={filters.name}
              onChange={handleFilterChange}
              placeholder="ابحث بالاسم"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-right"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-600 text-right">اسم المستخدم</label>
            <input
              type="text"
              name="username"
              value={filters.username}
              onChange={handleFilterChange}
              placeholder="ابحث باسم المستخدم"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-right"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-600 text-right">حالة المستخدم</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-right appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAyMCAyMCIgc3Ryb2tlPSIjNmI3MjgwIiBzdHJva2Utd2lkdGg9IjEuNSI+PHBhdGggc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBkPSJNNiA4bDQgNCA0LTRoLTgiLz48L3N2Zz4=')] bg-no-repeat bg-[right:1rem_center] bg-[length:1.5em]"
            >
              <option value="">الكل</option>
              <option value="false">مفعل</option>
              <option value="true">غير مفعل</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-600 text-right">الصلاحية</label>
            <select
              name="userType"
              value={filters.userType}
              onChange={handleFilterChange}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-right appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAyMCAyMCIgc3Ryb2tlPSIjNmI3MjgwIiBzdHJva2Utd2lkdGg9IjEuNSI+PHBhdGggc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBkPSJNNiA4bDQgNCA0LTRoLTgiLz48L3N2Zz4=')] bg-no-repeat bg-[right:1rem_center] bg-[length:1.5em]"
            >
              <option value="">الكل</option>
              <option value="admin">admin</option>
              <option value="user">user</option>
              <option value="reporter">reporter</option>
              <option value="checker">checker</option>
              <option value="supervisor">supervisor</option>
              <option value="superadmin">superadmin</option>
              <option value="printer">printer</option>
            </select>
          </div>
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
                <th className="px-4 py-3 text-right text-blue-600 font-semibold">حالة المستخدم</th>
                <th className="px-4 py-3 text-right text-blue-600 font-semibold">الموقع</th>
                <th className="px-4 py-3 text-right text-blue-600 font-semibold">الصلاحية</th>
                <th className="px-4 py-3 text-right text-blue-600 font-semibold">اسم المستخدم</th>
                <th className="px-4 py-3 text-right text-blue-600 font-semibold">الاسم</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-blue-200">
              {users.map((user, index) => (
                <tr key={index} className={`hover:bg-blue-50 transition-colors ${user.disabled ? 'opacity-100' : ''}`}>
                  <td className="px-4 py-3 text-right">
                  {user.disabled ? (
                      <EnableUsers userId={user.id} onEnable={handleEnableUser} />
                    ) : (
                      <DisableUsers userId={user.id} onDisable={handleDisableUser} isDisabled={user.disabled} />
                    )}
                    <button
                      className={`ml-2 ${user.disabled ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600'}`}
                      onClick={() => !user.disabled && handleEditUser(user.id)}
                      disabled={user.disabled}
                    >
                      <PencilIcon className={`w-6 h-5 ${user.disabled ? 'text-gray-400' : 'text-blue-600'}`} />
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right text-gray-700">{user.disabled ? "غير مفعل" : "مفعل"}</td>
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

      {/* Pagination Controls */}
      <div className="flex justify-center mt-8">
        <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
          <button
            onClick={() => handlePageChange(filters.page - 1)}
            disabled={filters.page === 0}
            className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50"
          >
            السابق
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => handlePageChange(i)}
              className={`px-4 py-2 text-sm font-medium ${
                filters.page === i
                  ? "text-green-600 bg-green-50 border border-green-500"
                  : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-50"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(filters.page + 1)}
            disabled={filters.page === totalPages - 1}
            className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50"
          >
            التالي
          </button>
        </nav>
      </div>

      {showAddUser && <AddUsers setShowAddUser={setShowAddUser} setUsers={handleAddUser} refreshUsers={refreshUsers}/>}
      {showUpdateUser && <UpdateUsers userId={userIdToUpdate} closeModal={() => setShowUpdateUser(false)} refreshUsers={refreshUsers} />}
      {isSuperAdmin && showUpdateUser && (
        <UpdateUsersBysuperadmin 
          userId={userIdToUpdate} 
          closeModal={() => setShowUpdateUser(false)} 
          refreshUsers={refreshUsers} 
        />
      )}
    </div>
  );
};
export default ShowUsers;