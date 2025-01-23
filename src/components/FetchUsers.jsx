import React, { useEffect, useState } from "react";

const FetchUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
    try {
        const response = await fetch("YOUR_API_ENDPOINT"); // Replace with the actual API endpoint
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        setCertificates(data);
        } catch (err) {
        setError("Failed to fetch users.");
        } finally {
        setLoading(false);
        }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <div>Loading users...</div>;
  }

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">User List</h2>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
{/*               <th className="border border-gray-300 p-2">ID</th>
              <th className="border border-gray-300 p-2">Name</th>
              <th className="border border-gray-300 p-2">Email</th> */}
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
{/*                 <td className="border border-gray-300 p-2">{user.id}</td>
                <td className="border border-gray-300 p-2">{user.name}</td>
                <td className="border border-gray-300 p-2">{user.email}</td> */}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default FetchUsers;
