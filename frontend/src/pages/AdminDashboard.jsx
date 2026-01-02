import React, { useState, useEffect } from 'react';
import { Trash2, User, Mail, Phone, Calendar, RefreshCcw, Search, ExternalLink, Edit, Filter, ArrowUpDown, Zap, Download } from 'lucide-react';
import api from '../api/axios';
import { toast } from 'react-toastify';
import Modal from '../components/Modal';

const AdminDashboard = () => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('date'); // 'name', 'date'
    const [sortOrder, setSortOrder] = useState('desc'); // 'asc', 'desc'
    const [selectedContact, setSelectedContact] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [contactToDelete, setContactToDelete] = useState(null);
    const [editFormData, setEditFormData] = useState({ name: '', email: '', phone: '', message: '' });

    const fetchContacts = async () => {
        setLoading(true);
        try {
            const response = await api.get('/contacts');
            setContacts(response.data);
        } catch (err) {
            toast.error('Failed to fetch contacts');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    const exportToCSV = () => {
        if (contacts.length === 0) {
            toast.info('No contacts to export');
            return;
        }

        const headers = ['Name', 'Email', 'Phone', 'Message', 'Date'];
        const csvContent = [
            headers.join(','),
            ...contacts.map(c => [
                `"${c.name}"`,
                `"${c.email}"`,
                `"${c.phone}"`,
                `"${(c.message || '').replace(/"/g, '""')}"`,
                `"${new Date(c.createdAt).toLocaleString()}"`
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `CollEdge_Contacts_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('CSV Exported Successfully');
    };

    const confirmDelete = (contact) => {
        setContactToDelete(contact);
        setIsDeleteModalOpen(true);
    };

    const deleteContact = async () => {
        if (!contactToDelete) return;

        try {
            await api.delete(`/contacts/${contactToDelete._id}`);
            toast.warning('Contact permanently removed');
            setContacts(contacts.filter(contact => contact._id !== contactToDelete._id));
            setIsDeleteModalOpen(false);
            setContactToDelete(null);
        } catch (err) {
            toast.error('Failed to delete contact');
            console.error(err);
        }
    };

    const handleEditClick = (contact) => {
        setSelectedContact(contact);
        setEditFormData({
            name: contact.name,
            email: contact.email,
            phone: contact.phone,
            message: contact.message || ''
        });
        setIsEditModalOpen(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await api.put(`/contacts/${selectedContact._id}`, editFormData);
            toast.success('Contact updated successfully');
            setContacts(contacts.map(c => c._id === selectedContact._id ? response.data : c));
            setIsEditModalOpen(false);
            setSelectedContact(null);
        } catch (err) {
            toast.error('Failed to update contact');
            console.error(err);
        }
    };

    const toggleSort = (type) => {
        if (sortBy === type) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(type);
            setSortOrder('asc');
        }
    };

    const filteredAndSortedContacts = contacts
        .filter(contact =>
            contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contact.phone.includes(searchTerm)
        )
        .sort((a, b) => {
            let comparison = 0;
            if (sortBy === 'name') {
                comparison = a.name.localeCompare(b.name);
            } else if (sortBy === 'date') {
                comparison = new Date(a.createdAt) - new Date(b.createdAt);
            }
            return sortOrder === 'asc' ? comparison : -comparison;
        });

    return (
        <div className="min-h-screen pt-28 md:pt-40 pb-20 px-3 md:px-8 bg-gray-50/50 dark:bg-[#050505]">
            <div className="container max-w-7xl mx-auto space-y-6 md:space-y-8">

                {/* Header Section */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="space-y-1">
                        <h1 className="text-2xl md:text-4xl font-black tracking-tighter text-gray-900 dark:text-white uppercase italic">
                            CollEdge <span className="text-primary dark:text-primary-neon">Dashboard</span>
                        </h1>
                        <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 font-medium">
                            Manage all inquiries and connections.
                        </p>
                    </div>

                    <div className="flex flex-col w-full md:w-auto gap-3">
                        {/* Search Bar - Full width on Mobile */}
                        <div className="relative group w-full md:w-80">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-neon transition-colors" size={16} />
                            <input
                                type="text"
                                placeholder="Search connections..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-3 rounded-xl md:rounded-2xl glass border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-primary-neon/50 focus:outline-none w-full font-medium text-xs md:text-sm"
                            />
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            {/* Export Button - Flexible */}
                            <button
                                onClick={exportToCSV}
                                className="flex-1 md:flex-none flex items-center justify-center space-x-2 px-4 py-2.5 bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-green-500 hover:text-white rounded-xl md:rounded-2xl transition-all font-black uppercase text-[10px] md:text-xs tracking-widest border border-green-500/20"
                            >
                                <Download size={14} />
                                <span>Export CSV</span>
                            </button>

                            {/* Sort Controls - Flexible */}
                            <div className="flex-1 md:flex-none flex items-center bg-white dark:bg-white/5 p-1 rounded-xl md:rounded-2xl border border-gray-100 dark:border-white/10">
                                <button
                                    onClick={() => toggleSort('name')}
                                    className={`flex-1 md:block flex items-center justify-center space-x-1.5 px-3 py-2 rounded-lg md:rounded-xl text-[10px] md:text-xs font-black uppercase tracking-wider transition-all ${sortBy === 'name' ? 'bg-primary dark:bg-primary-neon text-white dark:text-black shadow-lg' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
                                >
                                    <User size={12} className="md:w-[14px] md:h-[14px]" /> <span className="hidden xs:inline">Name</span> {sortBy === 'name' && <ArrowUpDown size={10} className="ml-1" />}
                                </button>
                                <button
                                    onClick={() => toggleSort('date')}
                                    className={`flex-1 md:block flex items-center justify-center space-x-1.5 px-3 py-2 rounded-lg md:rounded-xl text-[10px] md:text-xs font-black uppercase tracking-wider transition-all ${sortBy === 'date' ? 'bg-primary dark:bg-primary-neon text-white dark:text-black shadow-lg' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
                                >
                                    <Calendar size={12} className="md:w-[14px] md:h-[14px]" /> <span className="hidden xs:inline">Date</span> {sortBy === 'date' && <ArrowUpDown size={10} className="ml-1" />}
                                </button>
                            </div>

                            <button
                                onClick={fetchContacts}
                                className="p-2.5 md:p-3.5 glass rounded-xl md:rounded-2xl hover:bg-white dark:hover:bg-white/10 transition-all active:scale-95 group border-gray-200 dark:border-white/10"
                                title="Refresh Data"
                            >
                                <RefreshCcw size={18} className={`md:w-5 md:h-5 ${loading ? 'animate-spin text-primary-neon' : 'text-gray-500 group-hover:text-primary-neon'}`} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats Summary - Responsive Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-2 gap-3 md:gap-6">
                    {[
                        { label: 'Total Contacts', labelShort: 'Total', value: contacts.length, icon: User, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                        { label: 'Recent (24h)', labelShort: 'Recent', value: contacts.filter(c => new Date(c.createdAt) > new Date(Date.now() - 24 * 60 * 60 * 1000)).length, icon: Zap, color: 'text-primary-neon', bg: 'bg-primary-neon/10' }
                    ].map((stat, i) => (
                        <div key={i} className="glass p-4 md:p-8 rounded-2xl md:rounded-[2rem] flex items-center gap-3 md:gap-6 border-white/20 dark:border-white/5 relative overflow-hidden group">
                            <div className={`absolute top-0 right-0 p-2 md:p-4 opacity-5 group-hover:opacity-10 transition-opacity ${stat.color}`}>
                                <stat.icon className="w-12 h-12 md:w-24 md:h-24" />
                            </div>
                            <div className={`p-3 md:p-5 rounded-xl md:rounded-2xl ${stat.bg} ${stat.color} shadow-inner`}>
                                <stat.icon size={18} className="md:w-7 md:h-7" strokeWidth={2.5} />
                            </div>
                            <div>
                                <p className="text-[9px] md:text-xs font-black text-gray-400 uppercase tracking-widest md:tracking-[0.2em] mb-0.5 md:mb-1">
                                    <span className="hidden sm:inline">{stat.label}</span>
                                    <span className="sm:hidden">{stat.labelShort}</span>
                                </p>
                                <p className="text-xl md:text-4xl font-black dark:text-white tracking-tighter">{stat.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Table Section - Improved Mobile Fitting */}
                <div className="glass overflow-hidden rounded-2xl md:rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[600px] md:min-w-full">
                            <thead className="bg-gray-50/80 dark:bg-white/5 text-gray-400 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em]">
                                <tr>
                                    <th className="px-4 md:px-8 py-4 md:py-6">Profile</th>
                                    <th className="px-4 md:px-8 py-4 md:py-6">Dial-In</th>
                                    <th className="px-4 md:px-8 py-4 md:py-6">Timestamp</th>
                                    <th className="px-4 md:px-8 py-4 md:py-6 hidden sm:table-cell">Context</th>
                                    <th className="px-4 md:px-8 py-4 md:py-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                                {loading && contacts.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-8 py-32 text-center">
                                            <div className="flex flex-col items-center space-y-4">
                                                <RefreshCcw className="animate-spin text-primary-neon" size={32} />
                                                <span className="text-gray-500 font-bold uppercase tracking-widest text-xs">Syncing...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredAndSortedContacts.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-8 py-32 text-center">
                                            <div className="flex flex-col items-center space-y-4">
                                                <Search className="text-gray-300" size={40} />
                                                <span className="text-gray-500 font-bold text-sm">No matches found.</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredAndSortedContacts.map((contact) => (
                                        <tr key={contact._id} className="hover:bg-primary/5 dark:hover:bg-primary-neon/5 transition-all group">
                                            <td className="px-4 md:px-8 py-4 md:py-6">
                                                <div className="flex items-center gap-3 md:gap-4">
                                                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-white/10 dark:to-white/5 text-gray-700 dark:text-white flex items-center justify-center font-black text-base md:text-lg border border-white/20">
                                                        {contact.name[0].toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-gray-900 dark:text-white uppercase tracking-tight text-xs md:text-sm">{contact.name}</p>
                                                        <p className="text-[10px] md:text-xs font-bold text-primary dark:text-primary-neon opacity-70 truncate max-w-[120px] md:max-w-none">{contact.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 md:px-8 py-4 md:py-6">
                                                <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 font-mono text-[10px] md:text-xs font-bold border border-transparent">
                                                    <Phone size={10} className="md:w-3 md:h-3" /> {contact.phone}
                                                </div>
                                            </td>
                                            <td className="px-4 md:px-8 py-4 md:py-6">
                                                <p className="text-[10px] md:text-xs font-black text-gray-500 dark:text-gray-400">{new Date(contact.createdAt).toLocaleDateString()}</p>
                                                <p className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase">{new Date(contact.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                            </td>
                                            <td className="px-4 md:px-8 py-4 md:py-6 max-w-xs hidden sm:table-cell">
                                                <p className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400 truncate italic">
                                                    {contact.message || '—'}
                                                </p>
                                            </td>
                                            <td className="px-4 md:px-8 py-4 md:py-6 text-right">
                                                <div className="flex items-center justify-end space-x-1.5 md:space-x-2">
                                                    <button
                                                        onClick={() => setSelectedContact(contact)}
                                                        className="p-2 md:p-2.5 bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white rounded-lg md:rounded-xl transition-all"
                                                        title="Quick View"
                                                    >
                                                        <ExternalLink size={14} className="md:w-4 md:h-4" strokeWidth={2.5} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleEditClick(contact)}
                                                        className="p-2 md:p-2.5 bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-white rounded-lg md:rounded-xl transition-all"
                                                        title="Modify"
                                                    >
                                                        <Edit size={14} className="md:w-4 md:h-4" strokeWidth={2.5} />
                                                    </button>
                                                    <button
                                                        onClick={() => confirmDelete(contact)}
                                                        className="p-2 md:p-2.5 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg md:rounded-xl transition-all"
                                                        title="Remove"
                                                    >
                                                        <Trash2 size={14} className="md:w-4 md:h-4" strokeWidth={2.5} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                <Modal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    title="Danger Zone"
                >
                    <div className="space-y-6 text-center py-4">
                        <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-glow">
                            <Trash2 size={40} strokeWidth={2.5} />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-black dark:text-white uppercase tracking-tighter">Confirm Deletion?</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium px-4">
                                You are about to permanently remove <span className="text-red-500 font-bold">{contactToDelete?.name}</span>'s records. This action cannot be undone.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 pt-4">
                            <button
                                onClick={deleteContact}
                                className="flex-1 bg-red-500 text-white py-4 rounded-xl font-black uppercase text-xs tracking-widest shadow-lg shadow-red-500/30 hover:bg-red-600 transition-all active:scale-95"
                            >
                                DESTROY RECORD
                            </button>
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="px-8 py-4 rounded-xl border-2 border-gray-200 dark:border-white/10 dark:text-white font-black text-xs tracking-widest hover:bg-gray-100 dark:hover:bg-white/10 transition-all"
                            >
                                KEEP IT
                            </button>
                        </div>
                    </div>
                </Modal>
            )}

            {/* View Details Modal - Optimized Spacing */}
            {selectedContact && !isEditModalOpen && !isDeleteModalOpen && (
                <Modal
                    isOpen={!!selectedContact}
                    onClose={() => setSelectedContact(null)}
                    title="Insight View"
                >
                    <div className="space-y-6 md:space-y-8 p-1 md:p-0">
                        <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6 p-4 md:p-6 rounded-2xl md:rounded-3xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 text-center sm:text-left">
                            <div className="w-16 h-16 md:w-20 md:h-20 rounded-[1.5rem] md:rounded-[2rem] bg-gradient-to-br from-primary to-primary-neon text-white flex items-center justify-center text-2xl md:text-3xl font-black shadow-2xl">
                                {selectedContact.name[0].toUpperCase()}
                            </div>
                            <div>
                                <h3 className="text-xl md:text-2xl font-black dark:text-white uppercase tracking-tighter mb-1 leading-none">{selectedContact.name}</h3>
                                <p className="text-primary-neon font-bold text-xs md:text-sm tracking-wide">{selectedContact.email}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                            <div className="p-4 md:p-5 rounded-xl md:rounded-2xl bg-gray-100/50 dark:bg-white/5 border border-transparent">
                                <p className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 md:mb-2 flex items-center"><Phone size={10} className="mr-1" /> Phone Line</p>
                                <p className="dark:text-white font-mono font-bold text-xs md:text-sm">{selectedContact.phone}</p>
                            </div>
                            <div className="p-4 md:p-5 rounded-xl md:rounded-2xl bg-gray-100/50 dark:bg-white/5 border border-transparent">
                                <p className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 md:mb-2 flex items-center"><Calendar size={10} className="mr-1" /> Logged At</p>
                                <p className="dark:text-white font-bold text-xs md:text-sm">{new Date(selectedContact.createdAt).toLocaleString()}</p>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute top-0 right-0 p-4 min-w-max hidden sm:block opacity-10">
                                <Mail size={40} className="text-primary-neon" />
                            </div>
                            <p className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Message Context</p>
                            <div className="p-4 md:p-6 rounded-2xl md:rounded-3xl bg-gray-50 dark:bg-white/5 dark:text-gray-200 text-xs md:text-sm leading-relaxed min-h-[100px] md:min-h-[120px] font-medium border border-gray-100 dark:border-white/10 italic">
                                "{selectedContact.message || 'The user did not provide a message.'}"
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-2">
                            <a
                                href={`mailto:${selectedContact.email}`}
                                className="flex-1 bg-primary dark:bg-primary-neon text-white dark:text-black py-3.5 md:py-4 rounded-xl md:rounded-2xl font-black uppercase text-[10px] md:text-xs tracking-widest shadow-lg hover:translate-y-[-2px] transition-all flex items-center justify-center"
                            >
                                <Mail className="mr-2" size={16} /> OPEN MAIL
                            </a>
                            <button
                                onClick={() => setSelectedContact(null)}
                                className="px-6 py-3.5 md:py-4 rounded-xl md:rounded-2xl border-2 border-gray-200 dark:border-white/10 dark:text-white font-black text-[10px] md:text-xs tracking-widest hover:bg-gray-100 dark:hover:bg-white/10 transition-all"
                            >
                                CLOSE
                            </button>
                        </div>
                    </div>
                </Modal>
            )}

            {/* Edit Modal - Optimized Spacing */}
            {isEditModalOpen && (
                <Modal
                    isOpen={isEditModalOpen}
                    onClose={() => { setIsEditModalOpen(false); setSelectedContact(null); }}
                    title="Update Profile"
                >
                    <form onSubmit={handleUpdate} className="space-y-4 md:space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 md:mb-2 px-1">Full Identity</label>
                                <input
                                    type="text"
                                    value={editFormData.name}
                                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                                    className="w-full px-4 py-3 md:px-5 md:py-4 bg-gray-50 dark:bg-white/5 rounded-xl md:rounded-2xl border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-primary-neon/50 outline-none text-xs md:text-sm font-bold dark:text-white"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 md:mb-2 px-1">Email Port</label>
                                    <input
                                        type="email"
                                        value={editFormData.email}
                                        onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                                        className="w-full px-4 py-3 md:px-5 md:py-4 bg-gray-50 dark:bg-white/5 rounded-xl md:rounded-2xl border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-primary-neon/50 outline-none text-xs md:text-sm font-bold dark:text-white"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 md:mb-2 px-1">Phone Line</label>
                                    <input
                                        type="tel"
                                        value={editFormData.phone}
                                        onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                                        className="w-full px-4 py-3 md:px-5 md:py-4 bg-gray-50 dark:bg-white/5 rounded-xl md:rounded-2xl border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-primary-neon/50 outline-none text-xs md:text-sm font-bold dark:text-white"
                                        required
                                        maxLength={10}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 md:mb-2 px-1">Connection Context</label>
                                <textarea
                                    value={editFormData.message}
                                    onChange={(e) => setEditFormData({ ...editFormData, message: e.target.value })}
                                    rows="3"
                                    className="w-full px-4 py-3 md:px-5 md:py-4 bg-gray-50 dark:bg-white/5 rounded-xl md:rounded-2xl border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-primary-neon/50 outline-none text-xs md:text-sm font-bold dark:text-white resize-none"
                                ></textarea>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                            <button
                                type="submit"
                                className="flex-1 bg-amber-500 text-white py-3.5 md:py-4 rounded-xl md:rounded-2xl font-black uppercase text-[10px] md:text-xs tracking-widest shadow-lg shadow-amber-500/30 hover:bg-amber-600 transition-all active:scale-95"
                            >
                                COMMIT CHANGES
                            </button>
                            <button
                                type="button"
                                onClick={() => { setIsEditModalOpen(false); setSelectedContact(null); }}
                                className="px-6 py-3.5 md:py-4 rounded-xl md:rounded-2xl border-2 border-gray-200 dark:border-white/10 dark:text-white font-black text-[10px] md:text-xs tracking-widest hover:bg-gray-100 dark:hover:bg-white/10 transition-all"
                            >
                                DISCARD
                            </button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    );
};

export default AdminDashboard;
