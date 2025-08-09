// hooks/useStatusLabels.js
import { useMemo } from 'react';
import {
  approvalStatusLabels,
  accountStatusLabels,
  membershipLevelLabels,
  productStatusLabels,
  insuranceStatusLabels,
  roleLabels,
  genderLabels,
  getLabel,
  mapOptionsWithLabels
} from '../utils/labelMappings';

export const useStatusLabels = () => {
  const labelMappings = useMemo(() => ({
    approval: approvalStatusLabels,
    account: accountStatusLabels,
    membership: membershipLevelLabels,
    product: productStatusLabels,
    insurance: insuranceStatusLabels,
    role: roleLabels,
    gender: genderLabels
  }), []);

  const getLabelForStatus = (status, type) => {
    return getLabel(status, labelMappings[type] || {});
  };

  const getOptionsWithLabels = (options, type) => {
    return mapOptionsWithLabels(options, labelMappings[type] || {});
  };

  return {
    labelMappings,
    getLabelForStatus,
    getOptionsWithLabels
  };
};