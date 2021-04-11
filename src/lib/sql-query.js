const querySlaves = `
  select distinct 
    s.id,
    s.name,
    substring(s.drives, 1, 1) 'vdrive'
  from
    OBJ_CAM c,  OBJ_SLAVE s right JOIN OBJ_GRABBER g on g.parent_id = s.id
  where
    c.parent_id = g.id
    and (c.flags = 0 or c.flags is null)
  order by 1`;

const queryCams = (slaveID) => `
  select
    CAST(c.id as int) 'id',
    c.[name] 'name'
  from
    OBJ_CAM c, OBJ_GRABBER g
  where
    c.parent_id=g.id
    and (c.flags = 0 or c.flags is null)
    and g.parent_id = '${slaveID}'
  order by 1`;

module.exports = {
  querySlaves,
  queryCams,
};
