package com.caffit.cafe.repository;

import com.caffit.cafe.domain.Cafe;
import java.util.List;

public interface CafeRepositoryCustom {
    List<Cafe> findWithinRadius(double lat, double lng, int radiusMeters);
}