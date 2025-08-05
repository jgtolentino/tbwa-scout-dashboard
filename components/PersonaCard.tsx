'use client';

import React from 'react';
import { User, TrendingUp, Clock, DollarSign, MapPin, Heart, ShoppingCart, Calendar } from 'lucide-react';

interface PersonaCardProps {
  persona: {
    persona_type: string;
    demographic_profile: any;
    behavioral_patterns: any;
    product_preferences: any;
    business_value: any;
    regional_affinity: any;
  };
  compact?: boolean;
  showDetails?: boolean;
  onClick?: () => void;
}

const PersonaCard: React.FC<PersonaCardProps> = ({ 
  persona, 
  compact = false, 
  showDetails = true,
  onClick 
}) => {
  // TBWA Design tokens
  const tokens = {
    colors: {
      tbwaYellow: '#FFD700',
      tbwaBlack: '#000000',
      tbwaWhite: '#FFFFFF',
      tbwaGray: '#4A4A4A',
      tbwaLightGray: '#F5F5F5',
      tbwaDarkYellow: '#E6C200',
      tbwaBlue: '#1E40AF',
      accentPurple: '#6B46C1',
      accentEmerald: '#059669',
      accentRed: '#DC2626',
      accentOrange: '#D97706'
    }
  };

  // Persona color mapping
  const getPersonaColor = (personaType: string) => {
    const colorMap: { [key: string]: string } = {
      'Juan': tokens.colors.accentEmerald,
      'Maria': tokens.colors.accentPurple,
      'Paolo': tokens.colors.tbwaBlue,
      'Lola Carmen': tokens.colors.accentOrange,
      'Tita Rosa': tokens.colors.accentRed
    };
    return colorMap[personaType] || tokens.colors.tbwaGray;
  };

  // Persona icons
  const getPersonaIcon = (personaType: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      'Juan': <User className="h-5 w-5" />,
      'Maria': <Heart className="h-5 w-5" />,
      'Paolo': <TrendingUp className="h-5 w-5" />,
      'Lola Carmen': <Calendar className="h-5 w-5" />,
      'Tita Rosa': <ShoppingCart className="h-5 w-5" />
    };
    return iconMap[personaType] || <User className="h-5 w-5" />;
  };

  const personaColor = getPersonaColor(persona.persona_type);
  const personaIcon = getPersonaIcon(persona.persona_type);

  if (compact) {
    return (
      <div 
        className={`rounded-lg p-4 border-l-4 cursor-pointer hover:shadow-md transition-all ${onClick ? 'hover:scale-102' : ''}`}
        style={{ 
          backgroundColor: tokens.colors.tbwaWhite,
          borderLeftColor: personaColor
        }}
        onClick={onClick}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
              style={{ backgroundColor: personaColor }}
            >
              <div style={{ color: tokens.colors.tbwaWhite }}>
                {personaIcon}
              </div>
            </div>
            <div>
              <h4 className="font-bold" style={{ color: tokens.colors.tbwaBlack }}>
                {persona.persona_type}
              </h4>
              <p className="text-sm" style={{ color: tokens.colors.tbwaGray }}>
                {persona.demographic_profile?.age_range} • {persona.demographic_profile?.occupation}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold" style={{ color: personaColor }}>
              {persona.business_value?.frequency_score}%
            </p>
            <p className="text-xs" style={{ color: tokens.colors.tbwaGray }}>
              Frequency
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`rounded-xl p-6 shadow-sm border cursor-pointer hover:shadow-lg transition-all ${onClick ? 'hover:scale-102' : ''}`}
      style={{ 
        backgroundColor: tokens.colors.tbwaWhite,
        borderColor: tokens.colors.tbwaLightGray,
        borderTop: `4px solid ${personaColor}`
      }}
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center mr-4"
            style={{ backgroundColor: personaColor }}
          >
            <div style={{ color: tokens.colors.tbwaWhite }}>
              {personaIcon}
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold" style={{ color: tokens.colors.tbwaBlack }}>
              {persona.persona_type}
            </h3>
            <p className="text-sm" style={{ color: tokens.colors.tbwaGray }}>
              {persona.demographic_profile?.occupation} • {persona.demographic_profile?.age_range}
            </p>
          </div>
        </div>
      </div>

      {showDetails && (
        <>
          {/* Demographics */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <h4 className="font-semibold mb-2 flex items-center" style={{ color: tokens.colors.tbwaGray }}>
                <User className="h-4 w-4 mr-1" />
                Demographics
              </h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span style={{ color: tokens.colors.tbwaGray }}>Gender:</span>
                  <span style={{ color: tokens.colors.tbwaBlack }}>{persona.demographic_profile?.gender}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: tokens.colors.tbwaGray }}>Income:</span>
                  <span style={{ color: tokens.colors.tbwaBlack }}>{persona.demographic_profile?.income_level}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: tokens.colors.tbwaGray }}>Location:</span>
                  <span style={{ color: tokens.colors.tbwaBlack }}>{persona.demographic_profile?.location_type}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2 flex items-center" style={{ color: tokens.colors.tbwaGray }}>
                <Clock className="h-4 w-4 mr-1" />
                Shopping Patterns
              </h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span style={{ color: tokens.colors.tbwaGray }}>Peak Time:</span>
                  <span style={{ color: tokens.colors.tbwaBlack }}>{persona.behavioral_patterns?.peak_shopping_times}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: tokens.colors.tbwaGray }}>Frequency:</span>
                  <span style={{ color: personaColor }}>{persona.behavioral_patterns?.shopping_frequency}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: tokens.colors.tbwaGray }}>Payment:</span>
                  <span style={{ color: tokens.colors.tbwaBlack }}>{persona.behavioral_patterns?.payment_preference}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Business Value */}
          <div className="mb-6">
            <h4 className="font-semibold mb-3 flex items-center" style={{ color: tokens.colors.tbwaGray }}>
              <DollarSign className="h-4 w-4 mr-1" />
              Business Value
            </h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold" style={{ color: personaColor }}>
                  ₱{persona.business_value?.average_transaction_value}
                </p>
                <p className="text-xs" style={{ color: tokens.colors.tbwaGray }}>Avg Transaction</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold" style={{ color: tokens.colors.accentEmerald }}>
                  ₱{persona.business_value?.monthly_ltv}
                </p>
                <p className="text-xs" style={{ color: tokens.colors.tbwaGray }}>Monthly LTV</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold" style={{ color: tokens.colors.tbwaBlue }}>
                  {persona.business_value?.frequency_score}%
                </p>
                <p className="text-xs" style={{ color: tokens.colors.tbwaGray }}>Frequency Score</p>
              </div>
            </div>
          </div>

          {/* Product Preferences */}
          <div className="mb-6">
            <h4 className="font-semibold mb-3 flex items-center" style={{ color: tokens.colors.tbwaGray }}>
              <ShoppingCart className="h-4 w-4 mr-1" />
              Top Products
            </h4>
            <div className="flex flex-wrap gap-2">
              {persona.product_preferences?.top_categories?.slice(0, 5).map((category: string, index: number) => (
                <span 
                  key={index}
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{ 
                    backgroundColor: `${personaColor}20`,
                    color: personaColor
                  }}
                >
                  {category}
                </span>
              ))}
            </div>
          </div>

          {/* Regional Affinity */}
          {persona.regional_affinity && (
            <div>
              <h4 className="font-semibold mb-3 flex items-center" style={{ color: tokens.colors.tbwaGray }}>
                <MapPin className="h-4 w-4 mr-1" />
                Regional Insights
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span style={{ color: tokens.colors.tbwaGray }}>Top Region:</span>
                  <span style={{ color: tokens.colors.tbwaBlack }}>{persona.regional_affinity?.top_regions?.[0]}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: tokens.colors.tbwaGray }}>Season Pattern:</span>
                  <span style={{ color: tokens.colors.tbwaBlack }}>{persona.regional_affinity?.seasonal_pattern}</span>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PersonaCard;