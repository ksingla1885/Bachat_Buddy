import { useState, useEffect } from 'react';
import * as api from '../services/api';

const TransferHistory = () => {
    const [transfers, setTransfers] = useState([]);
    const [wallets, setWallets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchWalletsAndTransfers();
    }, []);

    const fetchWalletsAndTransfers = async () => {
        setIsLoading(true);
        try {
            const [walletRes, transferRes] = await Promise.all([
                api.getWallets(),
                api.getTransactions({ type: 'Transfer', limit: 1000 })
            ]);
            setWallets(walletRes.data.data.wallets || []);
            setTransfers(transferRes.data.data.transactions || []);
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Error fetching transfer history');
            setTransfers([]);
        } finally {
            setIsLoading(false);
        }
    };

    const getWalletName = (id) => wallets.find(w => w._id === id)?.name || id;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Transfer History</h1>
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                    {error}
                </div>
            )}
            {isLoading ? (
                <div className="flex items-center justify-center h-40">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-700 text-left text-gray-500 uppercase text-xs">
                                <th className="py-2 px-4">Date</th>
                                <th className="py-2 px-4">Amount</th>
                                <th className="py-2 px-4">From</th>
                                <th className="py-2 px-4">To</th>
                                <th className="py-2 px-4">Notes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transfers.length === 0 ? (
                                <tr><td colSpan={5} className="py-4 px-4 text-center text-gray-600">No transfers found.</td></tr>
                            ) : (
                                transfers.map(t => (
                                    <tr key={t._id} className="border-t">
                                        <td className="py-2 px-4">{new Date(t.date).toLocaleString()}</td>
                                        <td className="py-2 px-4">₹{Number(t.amount).toLocaleString()}</td>
                                        <td className="py-2 px-4">{getWalletName(t.walletId)}</td>
                                        <td className="py-2 px-4">{getWalletName(t.toWallet)}</td>
                                        <td className="py-2 px-4">{t.notes || '-'}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default TransferHistory;
