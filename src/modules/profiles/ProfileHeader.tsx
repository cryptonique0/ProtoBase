import React from 'react';
import type { BuilderProfile, BuilderProject } from '../../types';

interface ProfileHeaderProps {
  profile: BuilderProfile;
  isOwnProfile?: boolean;
  onEdit?: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ 
  profile, 
  isOwnProfile = false,
  onEdit 
}) => {
  return (
    <div className="bg-surface-dark border border-border-dark rounded-2xl p-8">
      <div className="flex items-start gap-6">
        {/* Avatar */}
        <div className="size-24 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center text-4xl font-bold text-primary">
          {profile.avatar ? (
            <img src={profile.avatar} alt={profile.displayName || 'Builder'} className="size-full rounded-full object-cover" />
          ) : (
            profile.displayName?.[0] || profile.username?.[0] || profile.address.slice(2, 4).toUpperCase()
          )}
        </div>

        {/* Profile Info */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-3xl font-bold text-white">
                {profile.displayName || profile.username || 'Anonymous Builder'}
              </h1>
              {profile.username && (
                <p className="text-sm text-text-secondary mt-1">@{profile.username}</p>
              )}
            </div>
            {isOwnProfile && (
              <button
                onClick={onEdit}
                className="px-4 py-2 bg-primary/10 border border-primary/30 rounded-xl text-sm font-bold text-primary hover:bg-primary/20 transition-all"
              >
                Edit Profile
              </button>
            )}
          </div>

          {/* Bio */}
          {profile.bio && (
            <p className="text-text-secondary text-sm mb-4 max-w-2xl">{profile.bio}</p>
          )}

          {/* Stats */}
          <div className="flex items-center gap-6 mt-4">
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-primary">{profile.reputation.xp.toLocaleString()}</span>
              <span className="text-xs text-text-secondary uppercase tracking-wider">XP</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-emerald-400">{profile.reputation.projectsLaunched}</span>
              <span className="text-xs text-text-secondary uppercase tracking-wider">Projects</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-blue-400">{profile.reputation.contractsDeployed}</span>
              <span className="text-xs text-text-secondary uppercase tracking-wider">Contracts</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-purple-400">Lv.{profile.reputation.level}</span>
              <span className="text-xs text-text-secondary uppercase tracking-wider">Level</span>
            </div>
          </div>

          {/* Social Links */}
          {profile.socials && (
            <div className="flex items-center gap-3 mt-4">
              {profile.socials.warpcast && (
                <a href={`https://warpcast.com/${profile.socials.warpcast}`} target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-[#855DCD] transition-colors">
                  <span className="text-sm">🟣</span>
                </a>
              )}
              {profile.socials.twitter && (
                <a href={`https://twitter.com/${profile.socials.twitter}`} target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-white transition-colors">
                  <span className="text-sm">𝕏</span>
                </a>
              )}
              {profile.socials.github && (
                <a href={`https://github.com/${profile.socials.github}`} target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-white transition-colors">
                  <span className="text-sm">🐙</span>
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
