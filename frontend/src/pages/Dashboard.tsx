import React from "react";
import { motion } from "framer-motion";
import ujjwal from "./ujjwal.png";
import arin from "./arin.png";
import anuj from "./anuj.png";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <motion.div
        className="bg-white rounded-lg shadow p-6 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-2xl font-bold mb-4">Welcome!!!</h1>
        <div className="space-y-4">
          {/* Container for Ujjwal Kaushik */}
          <motion.div
            className="space-y-2 p-4 border rounded-lg relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <img
              src={ujjwal}
              alt="Ujjwal Kaushik"
              className="absolute top-6 right-10 w-20 h-20 rounded-full border"
            />
            <p>
              <strong>Name:</strong> Ujjwal Kaushik
            </p>
            <p>
              <strong>SAP ID:</strong> 500108694
            </p>
            <p>
              <strong>Batch:</strong> Full Stack AI(B1-Honors)
            </p>
          </motion.div>

          {/*Container for Arin Rawat*/}
          <motion.div
            className="space-y-2 p-4 border rounded-lg relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <img
              src={arin}
              alt="Arin Rawat"
              className="absolute top-6 right-10 w-20 h-20 rounded-full border"
            />
            <p>
              <strong>Name:</strong> Arin Rawat
            </p>
            <p>
              <strong>SAP ID:</strong> 500108381
            </p>
            <p>
              <strong>Batch:</strong> Full Stack AI B3
            </p>
          </motion.div>

          {/* Container for Anuj Gupta */}
          <motion.div
            className="space-y-2 p-4 border rounded-lg relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            <img
              src={anuj}
              alt="Anuj Gupta"
              className="absolute top-6 right-10 w-20 h-20 rounded-full border"
            />
            <p>
              <strong>Name:</strong> Anuj Gupta
            </p>
            <p>
              <strong>SAP ID:</strong> 500107370
            </p>
            <p>
              <strong>Batch:</strong> Full Stack AI(B1-Honors)
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
