
// DeleteUsers.jsx
import React from "react";
import { TrashIcon } from "@heroicons/react/24/outline";
import fetchData from "../utils/fetchData";

const DeleteUsers = ({ userId, onDisable, isDisabled }) => {
  const handleDelete = async () => {
    if (isDisabled) return;

    if (!userId) {
      alert("خطأ: معرف المستخدم غير موجود!");
      return;
    }

    const confirmDelete = window.confirm("هل أنت متأكد من حذف هذا المستخدم؟");
    if (!confirmDelete) return;

    try {
      const response = await fetchData(`Users/${userId}/delete-user-account`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      if (response.isSuccess) {
        onDisable(userId);
      } else {
        alert("فشل في حذف المستخدم");
      }
    } catch (error) {
      alert("حدث خطأ أثناء حذف المستخدم");
    }
  };

  return (
    <button
      onClick={handleDelete}
      className={`text-red-600 hover:text-red-800 ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
      disabled={isDisabled}
    >
      <TrashIcon className="w-5 h-5" />
    </button>
  );
};

export default DeleteUsers;
