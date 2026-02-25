import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  ChevronDown, 
  X, 
  Trash2, 
  Info, 
  Activity,
  ChevronLeft,
  ChevronRight,
  Eye,
  Play,
  Pause,
  RefreshCw,
  Image as ImageIcon
} from 'lucide-react';

function Contributions() {
  const { currentUser } = useAuth();
  
  const [contributions, setContributions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState('recent'); // 'recent' or 'old'
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnalyzed, setShowAnalyzed] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState({});

  useEffect(() => {
    loadContributions();
  }, [sortOrder]);

  const loadContributions = async () => {
    setIsLoading(true);
    
    // TODO: Replace with actual API call to fetch user's contributions
    // Example: const response = await fetch('YOUR_API/contributions', {
    //   headers: { 'Authorization': `Bearer ${await currentUser.getIdToken()}` }
    // });
    
    // Simulated data
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockContributions = [
      {
        id: 1,
        type: 'image',
        url: '/api/placeholder/400/400',
        thumbnailUrl: '/api/placeholder/200/200',
        createdAt: new Date('2024-02-15T10:30:00'),
        metadata: {
          size: 2.5,
          location: 'Kolkata, West Bengal',
          remoteUrl: 'https://backend.example.com/uploads/image1.jpg'
        }
      },
      {
        id: 2,
        type: 'video',
        url: '/api/placeholder/400/400',
        thumbnailUrl: '/api/placeholder/200/200',
        createdAt: new Date('2024-02-15T14:20:00'),
        metadata: {
          size: 15.3,
          location: 'Kolkata, West Bengal',
          duration: 30
        }
      },
      {
        id: 3,
        type: 'image',
        url: '/api/placeholder/400/400',
        thumbnailUrl: '/api/placeholder/200/200',
        createdAt: new Date('2024-02-14T09:15:00'),
        metadata: {
          size: 3.1,
          location: 'Howrah, West Bengal'
        }
      }
    ];

    const sorted = mockContributions.sort((a, b) => {
      return sortOrder === 'recent' 
        ? b.createdAt - a.createdAt 
        : a.createdAt - b.createdAt;
    });

    setContributions(sorted);
    setIsLoading(false);
  };

  const groupByDate = (items) => {
    const groups = {};
    items.forEach(item => {
      const dateKey = item.createdAt.toDateString();
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(item);
    });
    return groups;
  };

  const formatDate = (date) => {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const handleDelete = async (item) => {
    const confirmed = window.confirm('This will permanently delete this media file. Continue?');
    if (!confirmed) return;

    // TODO: API call to delete
    setContributions(prev => prev.filter(c => c.id !== item.id));
    if (selectedMedia?.id === item.id) {
      setSelectedMedia(null);
    }
  };

  const openViewer = (item) => {
    const index = contributions.findIndex(c => c.id === item.id);
    setCurrentIndex(index);
    setSelectedMedia(contributions[index]);
  };

  const navigateMedia = (direction) => {
    const newIndex = direction === 'next' 
      ? Math.min(currentIndex + 1, contributions.length - 1)
      : Math.max(currentIndex - 1, 0);
    
    setCurrentIndex(newIndex);
    setSelectedMedia(contributions[newIndex]);
  };

  const handleAnalyze = async () => {
    if (!selectedMedia || selectedMedia.type === 'video') {
      alert('Analysis supports images only');
      return;
    }

    const mediaId = selectedMedia.id;
    
    if (analysisResults[mediaId]) {
      setShowAnalyzed(!showAnalyzed);
      return;
    }

    setIsAnalyzing(true);

    try {
      const idToken = await currentUser.getIdToken();
      
      // TODO: Replace with actual inference endpoint
      // const response = await fetch('YOUR_API/infer', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${idToken}`
      //   },
      //   body: JSON.stringify({ file_url: selectedMedia.metadata.remoteUrl })
      // });

      // Simulated response
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockAnalysis = {
        imageUrl: selectedMedia.url, // Would be the analyzed image URL
        totalPersons: 3,
        depth: {
          average_cm: 45.2,
          min_cm: 30.5,
          max_cm: 60.8
        },
        personDepths: [
          {
            person_id: 1,
            status: 'visible',
            first_visible_keypoint: 'nose',
            estimated_depth_cm: 45.2,
            confidence: 0.92
          },
          {
            person_id: 2,
            status: 'partial',
            first_visible_keypoint: 'shoulder',
            estimated_depth_cm: 50.1,
            confidence: 0.85
          },
          {
            person_id: 3,
            status: 'visible',
            first_visible_keypoint: 'hip',
            estimated_depth_cm: 38.7,
            confidence: 0.88
          }
        ]
      };

      setAnalysisResults(prev => ({
        ...prev,
        [mediaId]: mockAnalysis
      }));
      setShowAnalyzed(true);
      
    } catch (error) {
      console.error('Analysis failed:', error);
      alert('Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const grouped = groupByDate(contributions);
  const dateKeys = Object.keys(grouped).sort((a, b) => {
    const dateA = new Date(a);
    const dateB = new Date(b);
    return sortOrder === 'recent' ? dateB - dateA : dateA - dateB;
  });

  const currentAnalysis = selectedMedia ? analysisResults[selectedMedia.id] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Contributions</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : contributions.length === 0 ? (
          <div className="max-w-md mx-auto">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200 p-8 text-center">
              <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No contributions yet
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Upload a photo or video from the form screen. Your contributions will appear here grouped by date.
              </p>
              <button
                onClick={loadContributions}
                className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Toolbar */}
            <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-lg border border-gray-200 px-4 py-2 w-fit">
              <ChevronDown className="w-5 h-5 text-gray-600" />
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="bg-transparent border-none outline-none text-gray-700 font-medium cursor-pointer"
              >
                <option value="recent">Recent to Old</option>
                <option value="old">Old to Recent</option>
              </select>
            </div>

            {/* Grouped Media */}
            {dateKeys.map(dateKey => (
              <div key={dateKey}>
                <h2 className="text-lg font-bold text-gray-900 mb-3">
                  {formatDate(new Date(dateKey))}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {grouped[dateKey].map(item => (
                    <MediaCard
                      key={item.id}
                      item={item}
                      onOpen={() => openViewer(item)}
                      onDelete={() => handleDelete(item)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Media Viewer Modal */}
      {selectedMedia && (
        <MediaViewer
          media={selectedMedia}
          allMedia={contributions}
          currentIndex={currentIndex}
          onClose={() => setSelectedMedia(null)}
          onNavigate={navigateMedia}
          onDelete={() => handleDelete(selectedMedia)}
          onAnalyze={handleAnalyze}
          isAnalyzing={isAnalyzing}
          analysisResult={currentAnalysis}
          showAnalyzed={showAnalyzed}
        />
      )}
    </div>
  );
}

function MediaCard({ item, onOpen, onDelete }) {
  return (
    <div
      onClick={onOpen}
      className="relative aspect-square rounded-xl overflow-hidden bg-white/60 backdrop-blur-sm border border-gray-200 cursor-pointer group hover:shadow-lg transition-shadow"
    >
      <img
        src={item.thumbnailUrl}
        alt=""
        className="w-full h-full object-cover"
      />
      
      {/* Delete button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="absolute top-2 left-2 p-2 bg-white/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
      >
        <Trash2 className="w-4 h-4 text-red-600" />
      </button>

      {/* Video indicator */}
      {item.type === 'video' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <div className="p-3 bg-white/80 backdrop-blur-sm rounded-full">
            <Play className="w-6 h-6 text-gray-900" />
          </div>
        </div>
      )}
    </div>
  );
}

function MediaViewer({ 
  media, 
  allMedia, 
  currentIndex, 
  onClose, 
  onNavigate, 
  onDelete,
  onAnalyze,
  isAnalyzing,
  analysisResult,
  showAnalyzed
}) {
  const [showInfo, setShowInfo] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  const handleKeyPress = (e) => {
    if (e.key === 'ArrowLeft') onNavigate('prev');
    if (e.key === 'ArrowRight') onNavigate('next');
    if (e.key === 'Escape') onClose();
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const togglePlayPause = () => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="bg-black/80 backdrop-blur-sm px-4 py-3 flex items-center justify-between">
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-white" />
        </button>
        <span className="text-white text-sm">
          {currentIndex + 1} / {allMedia.length}
        </span>
        <div className="w-9" /> {/* Spacer */}
      </div>

      {/* Media Display */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden">
        {media.type === 'video' ? (
          <div className="relative w-full h-full flex items-center justify-center">
            <video
              ref={videoRef}
              src={media.url}
              className="max-w-full max-h-full"
              onClick={togglePlayPause}
            />
            {!isPlaying && (
              <div 
                onClick={togglePlayPause}
                className="absolute inset-0 flex items-center justify-center cursor-pointer"
              >
                <div className="p-6 bg-black/50 rounded-full">
                  <Play className="w-12 h-12 text-white" />
                </div>
              </div>
            )}
          </div>
        ) : (
          <img
            src={showAnalyzed && analysisResult ? analysisResult.imageUrl : media.url}
            alt=""
            className="max-w-full max-h-full object-contain"
          />
        )}

        {/* Navigation Arrows */}
        {currentIndex > 0 && (
          <button
            onClick={() => onNavigate('prev')}
            className="absolute left-4 p-3 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
        )}
        {currentIndex < allMedia.length - 1 && (
          <button
            onClick={() => onNavigate('next')}
            className="absolute right-4 p-3 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        )}

        {/* Analysis HUD */}
        {analysisResult && showAnalyzed && media.type === 'image' && (
          <div className="absolute bottom-32 left-4 right-4 bg-gray-900/90 backdrop-blur-sm rounded-2xl border border-cyan-500/30 p-4">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-cyan-500/20 rounded-full border border-cyan-500/40">
                <Activity className="w-6 h-6 text-cyan-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold mb-1">Flood Depth Estimate</h3>
                <p className="text-gray-300 text-sm">
                  Persons: {analysisResult.totalPersons} | 
                  Avg: {analysisResult.depth.average_cm.toFixed(2)} cm | 
                  Min: {analysisResult.depth.min_cm.toFixed(2)} cm | 
                  Max: {analysisResult.depth.max_cm.toFixed(2)} cm
                </p>
              </div>
              <button
                onClick={() => setShowDetails(true)}
                className="px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg font-medium transition-colors text-sm"
              >
                DETAILS
              </button>
            </div>
          </div>
        )}

        {/* Analyzing Overlay */}
        {isAnalyzing && (
          <div className="absolute inset-0 bg-black/75 flex items-center justify-center">
            <div className="bg-gray-900/95 backdrop-blur-sm rounded-2xl border border-cyan-500/40 p-6 max-w-sm w-full mx-4 shadow-xl shadow-cyan-500/20">
              <div className="flex items-center gap-3 mb-4">
                <Activity className="w-5 h-5 text-cyan-400" />
                <h3 className="text-white font-semibold">Running inference</h3>
              </div>
              
              <div className="bg-black/40 rounded-lg p-4 mb-4 relative overflow-hidden">
                <p className="text-gray-400 text-xs tracking-wide font-mono">
                  SEGMENTATION → POSE → DEPTH
                </p>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent animate-scan"></div>
              </div>

              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-cyan-400 border-t-transparent"></div>
                <p className="text-gray-300 text-sm">Analyzing... please wait</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Controls */}
      <div className="bg-black/80 backdrop-blur-sm px-4 py-6">
        <div className="flex items-center justify-center gap-12">
          <button
            onClick={() => setShowInfo(true)}
            className="flex flex-col items-center gap-1 hover:opacity-80 transition-opacity"
          >
            <Info className="w-6 h-6 text-white" />
            <span className="text-white text-xs">Info</span>
          </button>

          {media.type === 'image' && (
            <button
              onClick={onAnalyze}
              disabled={isAnalyzing}
              className="flex flex-col items-center gap-1 hover:opacity-80 transition-opacity disabled:opacity-50"
            >
              {analysisResult && showAnalyzed ? (
                <Eye className="w-6 h-6 text-white" />
              ) : (
                <Activity className="w-6 h-6 text-white" />
              )}
              <span className="text-white text-xs">
                {analysisResult ? (showAnalyzed ? 'Analyzed' : 'Analyze') : 'Analyze'}
              </span>
            </button>
          )}

          <button
            onClick={onDelete}
            className="flex flex-col items-center gap-1 hover:opacity-80 transition-opacity"
          >
            <Trash2 className="w-6 h-6 text-red-500" />
            <span className="text-white text-xs">Delete</span>
          </button>
        </div>
      </div>

      {/* Info Modal */}
      {showInfo && (
        <InfoModal
          media={media}
          onClose={() => setShowInfo(false)}
        />
      )}

      {/* Analysis Details Modal */}
      {showDetails && analysisResult && (
        <AnalysisDetailsModal
          analysis={analysisResult}
          onClose={() => setShowDetails(false)}
        />
      )}

      <style jsx>{`
        @keyframes scan {
          0%, 100% { transform: translateY(-100%); }
          50% { transform: translateY(100%); }
        }
        .animate-scan {
          animation: scan 1.4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

function InfoModal({ media, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold text-lg">Media Information</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="space-y-3">
          <InfoRow label="Type" value={media.type === 'video' ? 'Video' : 'Image'} />
          <InfoRow label="Size" value={`${media.metadata.size} MB`} />
          <InfoRow label="Location" value={media.metadata.location} />
          <InfoRow label="Uploaded" value={media.createdAt.toLocaleString()} />
          {media.metadata.remoteUrl && (
            <InfoRow label="Remote URL" value={media.metadata.remoteUrl} />
          )}
          
          <div className="pt-4 border-t border-gray-700">
            <h4 className="text-white font-semibold mb-2">Flood Information</h4>
            <p className="text-gray-400 text-sm">No flood data available for this media.</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div>
      <p className="text-gray-500 text-xs mb-1">{label}</p>
      <p className="text-white text-sm font-medium break-all">{value}</p>
    </div>
  );
}

function AnalysisDetailsModal({ analysis, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-gray-900 rounded-t-2xl sm:rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-4 flex items-center gap-3">
          <Activity className="w-5 h-5 text-cyan-400" />
          <h3 className="text-white font-semibold flex-1">Inference Report</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="p-4 space-y-3">
          {analysis.personDepths.slice(0, 5).map((person, index) => (
            <div
              key={index}
              className="bg-white/5 rounded-xl border border-cyan-500/20 p-4"
            >
              <h4 className="text-white font-semibold mb-2">Person {person.person_id}</h4>
              <div className="space-y-1 text-sm">
                <p className="text-gray-300">
                  <span className="text-gray-400">Status:</span> {person.status}
                </p>
                <p className="text-gray-300">
                  <span className="text-gray-400">First visible keypoint:</span> {person.first_visible_keypoint}
                </p>
                <p className="text-gray-300">
                  <span className="text-gray-400">Depth:</span> {person.estimated_depth_cm.toFixed(2)} cm
                </p>
                <p className="text-gray-300">
                  <span className="text-gray-400">Confidence:</span> {person.confidence.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Contributions;