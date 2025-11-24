package com.caffit.cafe.repository;

import com.caffit.cafe.domain.Cafe;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class CafeRepositoryImpl implements CafeRepositoryCustom {

    @PersistenceContext
    private EntityManager em;

    @Override
    public List<Cafe> findWithinRadius(double lat, double lng, int radiusMeters) {
        return em.createQuery("""
            SELECT c FROM Cafe c
            WHERE function('ST_Distance_Sphere',
                           point(:lng, :lat),
                           point(c.lng, c.lat)
                   ) <= :radius
            """, Cafe.class)
            .setParameter("lat", lat)
            .setParameter("lng", lng)
            .setParameter("radius", radiusMeters)
            .getResultList();
    }
}