//=============================================================================
// BattleGrow.js
//=============================================================================

/*:ja
 * @plugindesc 戦闘の行動に応じた成長をするシステムを提供
 * @author tanisobe
 *
 * @help このプラグインにはプラグインコマンドはありません。
 * 
 * skillのメモ欄に<var_id: 1>, <var_diff:2 >と記述すると変数ID1の変数に+2加算される。
 */

(function() {

  BattleManager.updateAction = function() {
      var target = this._targets.shift();
      if (target) {
          this.invokeAction(this._subject, target);
          if (this._action._subjectActorId > 0 && this._action._item.isSkill()){
              var id = $dataSkills[this._action._item._itemId].meta.var_id
              var diff = $dataSkills[this._action._item._itemId].meta.var_diff
              if ( id && diff ) {
                  $gameVariables._data[Number(id)] += Number(diff)
                  if ($gameVariables._data[Number(id)] >= 100) {
                      switch (Number(id)){
                          //Atk
                          case 4:
                              this._subject.addParam(2, 2);
                              $gameVariables._data[Number(id)] -= 100
                              break;
                          //Def
                          case 5:
                              this._subject.addParam(3, 1);
                              $gameVariables._data[Number(id)] -= 100
                              break;
                          //MP
                          case 3:
                              this._subject.addParam(1, 5);
                              $gameVariables._data[Number(id)] -= 100
                              break;
                          //Maf
                          case 7:
                              this._subject.addParam(4, 3);
                              $gameVariables._data[Number(id)] -= 100
                              break;
                      }
                  }
              }
          }
          if (this._subject.mhp >= this._subject.mmp) {
              $gameVariables._data[3] += 3
              if ($gameVariables._data[3] >= 100) {
                  this._subject.addParam(1, 2);
                  $gameVariables._data[3] -= 100
              }
          }
      } else {
          this.endAction();
      }
  };

  Game_Action.prototype.executeHpDamage = function(target, value) {
      if (this.isDrain()) {
          value = Math.min(target.hp, value);
      }
      this.makeSuccess(target);
      target.gainHp(-value);
      if (value > 0) {
          target.onDamage(value);
      }
      this.gainDrainedHp(value);
      if (target.isActor()) {
          var damageRate = Math.floor(value * 100 / target.mhp)
          if (damageRate >= 10 ) {
              $gameVariables._data[5] += 15
              if ($gameVariables._data[2]) {
                  $gameVariables._data[2] +=2
              }else{
                  $gameVariables._data[2] = 2
              }
          }else if (damageRate >= 30) {
              $gameVariables._data[5] += 30
              if ($gameVariables._data[2]) {
                  $gameVariables._data[2] +=4
              }else{
                  $gameVariables._data[2] = 4
              }
          }
          //HP up
          if ($gameVariables._data[2] >= 20) {
              target.addParam(0, 5);
              $gameVariables._data[2] -= 20
          }
          if ($gameVariables._data[5] >= 100) {
              target.addParam(3, 1);
              $gameVariables._data[5] -= 100
          }
      }
  };

  Game_Action.prototype.executeMpDamage = function(target, value) {
      if (!this.isMpRecover()) {
          value = Math.min(target.mp, value);
      }
      if (value !== 0) {
          this.makeSuccess(target);
      }
      target.gainMp(-value);
      this.gainDrainedMp(value);
      if (target.Actor()) {
          $gameVariables._data[3] += 10
      }
  };


  BattleManager.updateTurnEnd = function() {
      this.startInput();
      // game phase advance
      $gameVariables._data[6] +=1
  };

  BattleManager.updateBattleEnd = function() {
      if (this.isBattleTest()) {
          AudioManager.stopBgm();
          SceneManager.exit();
      } else if ($gameParty.isAllDead()) {
          if (this._canLose) {
              $gameParty.reviveBattleMembers();
              SceneManager.pop();
          } else {
              SceneManager.goto(Scene_Gameover);
          }
      } else {
          SceneManager.pop();
      }
      // recover actor hp and mp
      $gameParty.allMembers().forEach(function(actor,index){
          actor._hp += Math.round(actor.mhp*0.2)
          actor._mp += Math.round(actor.mmp*0.2)
      })
      this._phase = null;
  };
})();
