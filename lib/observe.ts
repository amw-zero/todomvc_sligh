import { State, AsyncAction } from './appstate';
import { TodoList } from '../model/todolist';

export type ModelObservation<S> = {
  type: "model_observation",
  state: S;
}

export type ImplObservation<S> = {
  type: "impl_observation";
  state: S;
}

type Observation<S> = 
  | ModelObservation<S>
  | ImplObservation<S>

type Invariant<S> = {
  name: string;
  func: (obs: Observation<S>[]) => boolean;
}

// type ActionObservation = {
//   action: AsyncAction;
//   observations: Observation[];
// }

type CorrelatedObservation = {
  states: State[];
}

export class Monitor<S> {
  observations: Observation<S>[] = [];

  async observe(o: Observation<S>) {
    this.observations.push(o);
  
    // checkModelConformance();
    // checkInvariants();
  
    console.log("New observation: ", { observations: monitor.observations });
  }
}

export const monitor = new Monitor<State>();

// const correlatedObservations: CorrelatedObservation = [];


// Judgements about traces / state transitions. Should report
// helpful error messages, along with the traces in which led to the error;
// const judgements: string[];

const invariants: Invariant<State>[] = [];

function checkInvariants() {
  for (const invariant of invariants) {
    if (!invariant.func(monitor.observations)) {
      throw new Error(`Invariant violated! ${invariant.name}\n\n${monitor.observations}`);
    }
  }
}

function checkModelConformance() {
  const model = new TodoList();
}

export function addInvariant(invariant: Invariant<State>) {
  invariants.push(invariant);
}

