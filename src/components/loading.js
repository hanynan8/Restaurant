import React, { useState, useEffect } from 'react';

const RestaurantLoading = () => {
  return (
    <div>
      <div className="home flex justify-center items-center h-screen">
        <div className="text-amber-700 text-xl">جاري تحميل البيانات...</div>
      </div>
    </div>
  );
};

export default RestaurantLoading;
