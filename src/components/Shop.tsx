/**
 * Shop Component
 * Purchase power-ups and permanent upgrades
 */

import { useState } from 'react';
import { ShoppingBag, X, TrendingUp, Users, Zap, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SHOP_UPGRADES, POWER_UPS } from '@/constants/gameConfig';
import type { ShopUpgrade } from '@/types/shop';

interface ShopProps {
    isOpen: boolean;
    onClose: () => void;
    money: number;
    totalMoneyEarned: number;
    upgradeLevels: Record<string, number>;
    onPurchaseUpgrade: (upgradeId: string) => void;
    onPurchasePowerUp: (powerUpId: string) => void;
    onPlaySound: (sound: any) => void;
}

type TabType = 'upgrades' | 'powerups';
type CategoryType = 'all' | 'special_customers' | 'gameplay' | 'economy';

export function Shop({
    isOpen,
    onClose,
    money,
    totalMoneyEarned,
    upgradeLevels,
    onPurchaseUpgrade,
    onPurchasePowerUp,
    onPlaySound
}: ShopProps) {
    const [activeTab, setActiveTab] = useState<TabType>('upgrades');
    const [activeCategory, setActiveCategory] = useState<CategoryType>('all');

    if (!isOpen) return null;

    const getUpgradeCost = (upgrade: typeof SHOP_UPGRADES[0]) => {
        const currentLevel = upgradeLevels[upgrade.id] || 0;
        return Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, currentLevel));
    };

    const getUpgradeValue = (upgrade: typeof SHOP_UPGRADES[0]) => {
        const currentLevel = upgradeLevels[upgrade.id] || 0;
        return upgrade.effect.baseValue + (upgrade.effect.valuePerLevel * currentLevel);
    };

    const canAffordUpgrade = (upgrade: typeof SHOP_UPGRADES[0]) => {
        const currentLevel = upgradeLevels[upgrade.id] || 0;
        if (currentLevel >= upgrade.maxLevel) return false;
        return money >= getUpgradeCost(upgrade);
    };

    const canAffordPowerUp = (powerUp: typeof POWER_UPS[0]) => {
        return money >= powerUp.cost;
    };

    const handlePurchaseUpgrade = (upgradeId: string) => {
        const upgrade = SHOP_UPGRADES.find(u => u.id === upgradeId);
        if (!upgrade || !canAffordUpgrade(upgrade)) {
            onPlaySound('error');
            return;
        }
        onPlaySound('coin');
        onPurchaseUpgrade(upgradeId);
    };

    const handlePurchasePowerUp = (powerUpId: string) => {
        const powerUp = POWER_UPS.find(p => p.id === powerUpId);
        if (!powerUp || !canAffordPowerUp(powerUp)) {
            onPlaySound('error');
            return;
        }
        onPlaySound('coin');
        onPurchasePowerUp(powerUpId);
    };

    const filteredUpgrades = SHOP_UPGRADES.filter(upgrade =>
        activeCategory === 'all' || upgrade.category === activeCategory
    );

    const getCategoryIcon = (category: CategoryType) => {
        switch (category) {
            case 'special_customers': return <Users className="w-4 h-4" />;
            case 'gameplay': return <Zap className="w-4 h-4" />;
            case 'economy': return <DollarSign className="w-4 h-4" />;
            default: return <TrendingUp className="w-4 h-4" />;
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-2xl max-h-[90vh] m-4 bg-gradient-to-br from-white to-slate-50 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">

                {/* Header */}
                <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 p-6 pb-8">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20" />

                    <div className="relative flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                                <ShoppingBag className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">Shop</h2>
                                <p className="text-white/80 text-sm">Upgrades & Power-ups</p>
                            </div>
                        </div>

                        <Button
                            onClick={onClose}
                            size="icon"
                            className="rounded-xl bg-white/20 hover:bg-white/30 border-0 text-white"
                        >
                            <X className="w-5 h-5" />
                        </Button>
                    </div>

                    {/* Money Display */}
                    <div className="relative mt-4 flex gap-3">
                        <div className="flex-1 bg-white/20 backdrop-blur-md rounded-2xl p-3 border border-white/30">
                            <div className="text-white/80 text-xs font-semibold uppercase tracking-wider">Current Money</div>
                            <div className="text-white text-2xl font-bold">${money}</div>
                        </div>
                        <div className="flex-1 bg-white/20 backdrop-blur-md rounded-2xl p-3 border border-white/30">
                            <div className="text-white/80 text-xs font-semibold uppercase tracking-wider">Total Earned</div>
                            <div className="text-white text-2xl font-bold">${totalMoneyEarned}</div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-200 bg-white px-6">
                    <button
                        onClick={() => setActiveTab('upgrades')}
                        className={`flex-1 py-4 font-semibold transition-all relative ${activeTab === 'upgrades'
                                ? 'text-purple-600'
                                : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        <TrendingUp className="w-4 h-4 inline mr-2" />
                        Permanent Upgrades
                        {activeTab === 'upgrades' && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600" />
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('powerups')}
                        className={`flex-1 py-4 font-semibold transition-all relative ${activeTab === 'powerups'
                                ? 'text-purple-600'
                                : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        <Zap className="w-4 h-4 inline mr-2" />
                        Power-ups
                        {activeTab === 'powerups' && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600" />
                        )}
                    </button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto max-h-[calc(90vh-280px)] p-6">
                    {activeTab === 'upgrades' && (
                        <>
                            {/* Category Filter */}
                            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                                {(['all', 'special_customers', 'gameplay', 'economy'] as CategoryType[]).map((category) => (
                                    <button
                                        key={category}
                                        onClick={() => setActiveCategory(category)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm whitespace-nowrap transition-all ${activeCategory === category
                                                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                            }`}
                                    >
                                        {getCategoryIcon(category)}
                                        {category === 'all' ? 'All' : category.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                                    </button>
                                ))}
                            </div>

                            {/* Upgrades Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {filteredUpgrades.map((upgrade) => {
                                    const currentLevel = upgradeLevels[upgrade.id] || 0;
                                    const cost = getUpgradeCost(upgrade);
                                    const currentValue = getUpgradeValue(upgrade);
                                    const nextValue = currentLevel < upgrade.maxLevel
                                        ? upgrade.effect.baseValue + (upgrade.effect.valuePerLevel * (currentLevel + 1))
                                        : currentValue;
                                    const canAfford = canAffordUpgrade(upgrade);
                                    const isMaxed = currentLevel >= upgrade.maxLevel;

                                    return (
                                        <div
                                            key={upgrade.id}
                                            className="bg-white rounded-2xl p-4 border-2 border-slate-200 hover:border-purple-300 transition-all hover:shadow-lg"
                                        >
                                            <div className="flex items-start gap-3">
                                                <div
                                                    className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl shadow-md flex-shrink-0"
                                                    style={{ background: upgrade.color + '20' }}
                                                >
                                                    {upgrade.emoji}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-bold text-slate-800 text-sm">{upgrade.name}</h3>
                                                    <p className="text-xs text-slate-500 mt-0.5">{upgrade.description}</p>

                                                    {/* Level Progress */}
                                                    <div className="mt-2 flex items-center gap-2">
                                                        <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                                                                style={{ width: `${(currentLevel / upgrade.maxLevel) * 100}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-xs font-bold text-slate-600">
                                                            {currentLevel}/{upgrade.maxLevel}
                                                        </span>
                                                    </div>

                                                    {/* Stats */}
                                                    <div className="mt-2 flex items-center justify-between">
                                                        <div className="text-xs">
                                                            <span className="text-slate-500">Current: </span>
                                                            <span className="font-bold text-purple-600">
                                                                {upgrade.effect.type.includes('chance')
                                                                    ? `${(currentValue * 100).toFixed(1)}%`
                                                                    : upgrade.effect.type.includes('multiplier')
                                                                        ? `${currentValue.toFixed(1)}x`
                                                                        : currentValue}
                                                            </span>
                                                            {!isMaxed && (
                                                                <>
                                                                    <span className="text-slate-400 mx-1">→</span>
                                                                    <span className="font-bold text-green-600">
                                                                        {upgrade.effect.type.includes('chance')
                                                                            ? `${(nextValue * 100).toFixed(1)}%`
                                                                            : upgrade.effect.type.includes('multiplier')
                                                                                ? `${nextValue.toFixed(1)}x`
                                                                                : nextValue}
                                                                    </span>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Purchase Button */}
                                                    <Button
                                                        onClick={() => handlePurchaseUpgrade(upgrade.id)}
                                                        disabled={!canAfford || isMaxed}
                                                        className={`w-full mt-3 rounded-xl font-bold text-sm ${isMaxed
                                                                ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                                                                : canAfford
                                                                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg'
                                                                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                                            }`}
                                                    >
                                                        {isMaxed ? '✓ Maxed Out' : `Upgrade - $${cost}`}
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    )}

                    {activeTab === 'powerups' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {POWER_UPS.map((powerUp) => {
                                const canAfford = canAffordPowerUp(powerUp);

                                return (
                                    <div
                                        key={powerUp.id}
                                        className="bg-white rounded-2xl p-4 border-2 border-slate-200 hover:border-purple-300 transition-all hover:shadow-lg"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div
                                                className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl shadow-md flex-shrink-0"
                                                style={{ background: powerUp.color + '20' }}
                                            >
                                                {powerUp.emoji}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-bold text-slate-800">{powerUp.name}</h3>
                                                <p className="text-xs text-slate-500 mt-1">{powerUp.description}</p>
                                                <div className="mt-2 text-xs text-slate-600">
                                                    <span className="font-semibold">Duration:</span> {powerUp.duration / 1000}s
                                                </div>
                                                <Button
                                                    onClick={() => handlePurchasePowerUp(powerUp.id)}
                                                    disabled={!canAfford}
                                                    className={`w-full mt-3 rounded-xl font-bold ${canAfford
                                                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg'
                                                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                                        }`}
                                                >
                                                    Buy - ${powerUp.cost}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
