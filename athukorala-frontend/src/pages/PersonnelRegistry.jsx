import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, ShieldCheck, ShieldAlert,
  ArrowUp, ArrowDown, Trash2, Search
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const containerVariants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, staggerChildren: 0.06 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 }
  }
};

const PersonnelRegistry = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchUsers = () => {
    fetch("http://localhost:8080/api/users/all")
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(() => toast.error("Failed to load users"));
  };

  useEffect(() => fetchUsers(), []);

  const handleDelete = async (userId, name) => {
    if (!window.confirm(`Delete ${name}?`)) return;

    const loading = toast.loading("Deleting...");
    try {
      const res = await fetch(`http://localhost:8080/api/users/${userId}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        toast.success("User Deleted", { id: loading });
        fetchUsers();
      } else {
        toast.error("Delete Failed", { id: loading });
      }
    } catch {
      toast.error("Server Error", { id: loading });
    }
  };

  const handleRoleChange = async (userId, currentRole, direction) => {
    const roles = ['CUSTOMER', 'STAFF', 'ADMIN'];
    const index = roles.indexOf(currentRole);
    const newIndex = direction === 'UP' ? index + 1 : index - 1;

    if (newIndex < 0 || newIndex >= roles.length) return;

    const newRole = roles[newIndex];
    const loading = toast.loading("Updating role...");

    try {
      const res = await fetch(`http://localhost:8080/api/users/${userId}/change-role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole })
      });

      if (res.ok) {
        toast.success(`Role updated to ${newRole}`, { id: loading });
        fetchUsers();
      }
    } catch {
      toast.error("Update failed", { id: loading });
    }
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* HEADER */}
      <motion.div
        variants={itemVariants}
        className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6"
      >
        <p className="text-xs uppercase tracking-[0.3em] text-[#D4AF37] mb-2">
          Personnel Control
        </p>
        <h2 className="text-3xl font-black text-white">
          Personnel Registry
        </h2>
      </motion.div>

      {/* SEARCH */}
      <motion.div variants={itemVariants} className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white outline-none focus:border-[#D4AF37]"
        />
      </motion.div>

      {/* LIST */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredUsers.map((person) => (
            <motion.div
              key={person.id}
              variants={itemVariants}
              className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-5 flex flex-col lg:flex-row justify-between gap-4 hover:bg-white/[0.06] transition"
            >
              {/* LEFT */}
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  person.role === 'ADMIN'
                    ? 'bg-[#D4AF37]/20 text-[#D4AF37]'
                    : person.role === 'STAFF'
                    ? 'bg-blue-500/20 text-blue-400'
                    : 'bg-gray-500/20 text-gray-400'
                }`}>
                  {person.role === 'ADMIN'
                    ? <ShieldAlert size={18} />
                    : person.role === 'STAFF'
                    ? <ShieldCheck size={18} />
                    : <User size={18} />}
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white uppercase">
                    {person.name}
                  </h3>
                  <p className="text-xs text-gray-400">{person.email}</p>
                  <span className="text-[10px] text-gray-500 uppercase">
                    {person.role}
                  </span>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="flex gap-2 flex-wrap">
                <ActionButton
                  icon={<Trash2 size={14} />}
                  label="Delete"
                  color="hover:text-red-400"
                  onClick={() => handleDelete(person.id, person.name)}
                />

                {person.role !== 'CUSTOMER' && (
                  <ActionButton
                    icon={<ArrowDown size={14} />}
                    label="Demote"
                    color="hover:text-orange-400"
                    onClick={() => handleRoleChange(person.id, person.role, 'DOWN')}
                  />
                )}

                {person.role !== 'ADMIN' && (
                  <ActionButton
                    icon={<ArrowUp size={14} />}
                    label="Promote"
                    color="hover:text-green-400"
                    onClick={() => handleRoleChange(person.id, person.role, 'UP')}
                  />
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const ActionButton = ({ icon, label, color, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-400 ${color} hover:bg-white/10 transition`}
  >
    {icon} {label}
  </button>
);

export default PersonnelRegistry;