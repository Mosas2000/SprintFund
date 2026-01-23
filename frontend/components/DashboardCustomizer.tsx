'use client';

import { useState, useEffect } from 'react';

interface Widget {
  id: string;
  title: string;
  type: 'proposals' | 'voting' | 'treasury' | 'activity' | 'reputation' | 'stats' | 'notifications' | 'trending';
  enabled: boolean;
  position: number;
  size: 'small' | 'medium' | 'large';
}

interface ColorScheme {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
}

interface Layout {
  id: string;
  name: string;
  widgets: Widget[];
  colorScheme: string;
}

interface DashboardCustomizerProps {
  userAddress: string;
}

export default function DashboardCustomizer({ userAddress }: DashboardCustomizerProps) {
  const [widgets, setWidgets] = useState<Widget[]>([
    { id: '1', title: 'Active Proposals', type: 'proposals', enabled: true, position: 0, size: 'large' },
    { id: '2', title: 'Voting Power', type: 'voting', enabled: true, position: 1, size: 'medium' },
    { id: '3', title: 'Treasury Overview', type: 'treasury', enabled: true, position: 2, size: 'medium' },
    { id: '4', title: 'Recent Activity', type: 'activity', enabled: false, position: 3, size: 'small' },
    { id: '5', title: 'Reputation Score', type: 'reputation', enabled: true, position: 4, size: 'small' },
    { id: '6', title: 'Statistics', type: 'stats', enabled: false, position: 5, size: 'large' },
    { id: '7', title: 'Notifications', type: 'notifications', enabled: true, position: 6, size: 'small' },
    { id: '8', title: 'Trending Topics', type: 'trending', enabled: false, position: 7, size: 'medium' }
  ]);

  const [colorSchemes] = useState<ColorScheme[]>([
    { id: 'ocean', name: 'Ocean Blue', primary: '#3B82F6', secondary: '#1E40AF', accent: '#60A5FA' },
    { id: 'forest', name: 'Forest Green', primary: '#10B981', secondary: '#059669', accent: '#34D399' },
    { id: 'sunset', name: 'Sunset Orange', primary: '#F59E0B', secondary: '#D97706', accent: '#FBBF24' },
    { id: 'purple', name: 'Royal Purple', primary: '#8B5CF6', secondary: '#6D28D9', accent: '#A78BFA' },
    { id: 'rose', name: 'Rose Pink', primary: '#EC4899', secondary: '#DB2777', accent: '#F472B6' }
  ]);

  const [selectedColorScheme, setSelectedColorScheme] = useState('ocean');
  const [layouts, setLayouts] = useState<Layout[]>([
    {
      id: 'default',
      name: 'Default Layout',
      widgets: widgets,
      colorScheme: 'ocean'
    }
  ]);
  const [currentLayout, setCurrentLayout] = useState('default');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [newLayoutName, setNewLayoutName] = useState('');
  const [draggedWidget, setDraggedWidget] = useState<string | null>(null);

  useEffect(() => {
    // Load saved customization from localStorage
    const saved = localStorage.getItem(`dashboard-customization-${userAddress}`);
    if (saved) {
      const data = JSON.parse(saved);
      setWidgets(data.widgets || widgets);
      setSelectedColorScheme(data.colorScheme || 'ocean');
      setLayouts(data.layouts || layouts);
      setCurrentLayout(data.currentLayout || 'default');
    }
  }, [userAddress]);

  const saveCustomization = () => {
    const data = {
      widgets,
      colorScheme: selectedColorScheme,
      layouts,
      currentLayout
    };
    localStorage.setItem(`dashboard-customization-${userAddress}`, JSON.stringify(data));
    alert('Dashboard customization saved!');
  };

  const toggleWidget = (id: string) => {
    setWidgets(widgets.map(w => w.id === id ? { ...w, enabled: !w.enabled } : w));
  };

  const changeWidgetSize = (id: string, size: 'small' | 'medium' | 'large') => {
    setWidgets(widgets.map(w => w.id === id ? { ...w, size } : w));
  };

  const saveLayout = () => {
    if (!newLayoutName.trim()) {
      alert('Please enter a layout name');
      return;
    }

    const newLayout: Layout = {
      id: Date.now().toString(),
      name: newLayoutName,
      widgets: [...widgets],
      colorScheme: selectedColorScheme
    };

    setLayouts([...layouts, newLayout]);
    setCurrentLayout(newLayout.id);
    setNewLayoutName('');
    setShowSaveDialog(false);
    alert('Layout saved successfully!');
  };

  const loadLayout = (layoutId: string) => {
    const layout = layouts.find(l => l.id === layoutId);
    if (layout) {
      setWidgets([...layout.widgets]);
      setSelectedColorScheme(layout.colorScheme);
      setCurrentLayout(layoutId);
    }
  };

  const deleteLayout = (layoutId: string) => {
    if (layoutId === 'default') {
      alert('Cannot delete default layout');
      return;
    }
    setLayouts(layouts.filter(l => l.id !== layoutId));
    if (currentLayout === layoutId) {
      setCurrentLayout('default');
      loadLayout('default');
    }
  };

  const resetToDefault = () => {
    if (confirm('Reset dashboard to default settings?')) {
      loadLayout('default');
    }
  };

  const handleDragStart = (widgetId: string) => {
    setDraggedWidget(widgetId);
  };

  const handleDragOver = (e: React.DragEvent, targetWidgetId: string) => {
    e.preventDefault();
    if (!draggedWidget || draggedWidget === targetWidgetId) return;

    const draggedIndex = widgets.findIndex(w => w.id === draggedWidget);
    const targetIndex = widgets.findIndex(w => w.id === targetWidgetId);

    const newWidgets = [...widgets];
    const [removed] = newWidgets.splice(draggedIndex, 1);
    newWidgets.splice(targetIndex, 0, removed);

    // Update positions
    newWidgets.forEach((w, idx) => w.position = idx);
    setWidgets(newWidgets);
  };

  const handleDragEnd = () => {
    setDraggedWidget(null);
  };

  const enabledWidgets = widgets.filter(w => w.enabled).sort((a, b) => a.position - b.position);
  const currentScheme = colorSchemes.find(s => s.id === selectedColorScheme);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-1">⚙️ Dashboard Customizer</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Personalize your workspace with drag-and-drop widgets
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={resetToDefault}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium 
                     hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            🔄 Reset
          </button>
          <button
            onClick={() => setShowSaveDialog(true)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700"
          >
            💾 Save Layout
          </button>
          <button
            onClick={saveCustomization}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            ✓ Apply Changes
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Customization Panel */}
        <div className="space-y-6">
          {/* Saved Layouts */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <h3 className="font-semibold mb-3">📐 Saved Layouts</h3>
            <div className="space-y-2">
              {layouts.map(layout => (
                <div
                  key={layout.id}
                  className={`p-3 rounded-lg border transition cursor-pointer ${
                    currentLayout === layout.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                  onClick={() => loadLayout(layout.id)}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{layout.name}</span>
                    {layout.id !== 'default' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteLayout(layout.id);
                        }}
                        className="text-red-500 hover:text-red-700 text-xs"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {layout.widgets.filter(w => w.enabled).length} widgets enabled
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Color Schemes */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <h3 className="font-semibold mb-3">🎨 Color Schemes</h3>
            <div className="space-y-2">
              {colorSchemes.map(scheme => (
                <div
                  key={scheme.id}
                  onClick={() => setSelectedColorScheme(scheme.id)}
                  className={`p-3 rounded-lg border cursor-pointer transition ${
                    selectedColorScheme === scheme.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{scheme.name}</span>
                    {selectedColorScheme === scheme.id && <span className="text-blue-600">✓</span>}
                  </div>
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded" style={{ backgroundColor: scheme.primary }} />
                    <div className="w-8 h-8 rounded" style={{ backgroundColor: scheme.secondary }} />
                    <div className="w-8 h-8 rounded" style={{ backgroundColor: scheme.accent }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Widget Controls */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <h3 className="font-semibold mb-3">🧩 Available Widgets</h3>
            <div className="space-y-3">
              {widgets.map(widget => (
                <div key={widget.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{widget.title}</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={widget.enabled}
                        onChange={() => toggleWidget(widget.id)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 
                                    peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer 
                                    dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white 
                                    after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white 
                                    after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 
                                    after:transition-all dark:border-gray-600 peer-checked:bg-blue-600" />
                    </label>
                  </div>
                  {widget.enabled && (
                    <div className="flex gap-1">
                      {(['small', 'medium', 'large'] as const).map(size => (
                        <button
                          key={size}
                          onClick={() => changeWidgetSize(widget.id, size)}
                          className={`flex-1 px-2 py-1 text-xs rounded transition ${
                            widget.size === size
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dashboard Preview */}
        <div className="lg:col-span-3">
          <div
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 min-h-[600px]"
            style={{ borderColor: currentScheme?.primary }}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold">Dashboard Preview</h3>
              <span className="text-xs text-gray-600 dark:text-gray-400">Drag to reorder widgets</span>
            </div>

            {enabledWidgets.length === 0 ? (
              <div className="text-center py-20 text-gray-500 dark:text-gray-400">
                <div className="text-4xl mb-2">📦</div>
                <div>No widgets enabled</div>
                <div className="text-sm">Enable some widgets to see your dashboard</div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {enabledWidgets.map(widget => (
                  <div
                    key={widget.id}
                    draggable
                    onDragStart={() => handleDragStart(widget.id)}
                    onDragOver={(e) => handleDragOver(e, widget.id)}
                    onDragEnd={handleDragEnd}
                    className={`rounded-lg border-2 border-dashed p-4 cursor-move transition 
                              hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 ${
                      widget.size === 'small' ? 'md:col-span-1' :
                      widget.size === 'medium' ? 'md:col-span-2 lg:col-span-2' :
                      'md:col-span-2 lg:col-span-3'
                    } ${draggedWidget === widget.id ? 'opacity-50' : ''}`}
                    style={{
                      borderColor: currentScheme?.primary,
                      backgroundColor: draggedWidget === widget.id 
                        ? `${currentScheme?.primary}20` 
                        : undefined
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-sm">{widget.title}</h4>
                      <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                        {widget.size}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      Widget content would appear here
                    </div>
                    <div className="mt-3 h-20 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
                      <span className="text-gray-400">Preview</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Save Layout Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Save Layout</h3>
            <input
              type="text"
              placeholder="Enter layout name..."
              value={newLayoutName}
              onChange={(e) => setNewLayoutName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg mb-4
                       bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowSaveDialog(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg font-medium
                         hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={saveLayout}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
