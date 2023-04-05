-- Horarios disponiveis sem considerar agendamento, somente o dia
SELECT H.* FROM horarios H, barbearia_horarios BH
WHERE H.Horario >= BH.BarbH_HoraInicio
AND H.Horario <= BH.BarbH_HoraFim
AND BH.BarbH_Dia = "TER";

-- Horarios ja agendados por codigo do barbeiro e data de agendamento
SELECT H.* FROM horarios H, agendamento A
WHERE H.Horario >= A.Agdm_HoraInicio
AND H.Horario <= A.Agdm_HoraFim
AND A.Agdm_Barbeiro = 1
AND A.Agdm_Data = '2023-04-04'
AND A.Agdm_Status NOT IN ('C', 'R');

-- Traz somente horarios disponiveis para agendamento
SELECT * FROM horarios
WHERE Horario NOT IN (
SELECT H.Horario FROM horarios H, agendamento A
WHERE H.Horario >= A.Agdm_HoraInicio
AND H.Horario < A.Agdm_HoraFim
AND A.Agdm_Barbeiro = 1
AND A.Agdm_Data = '2023-04-01'
AND A.Agdm_Status NOT IN ('C', 'R'))
AND Horario IN (
SELECT H.Horario FROM horarios H, barbearia_horarios BH
WHERE H.Horario >= BH.BarbH_HoraInicio
AND H.Horario <= BH.BarbH_HoraFim
AND BH.BarbH_Dia = "SEG");